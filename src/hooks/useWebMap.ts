import { useContext, useEffect, useState } from "react";

import { AppContext } from "../contexts/App";

type useWebMapResponse = [HTMLDivElement, (a: HTMLDivElement) => void];

const useWebMap = (element: HTMLDivElement): useWebMapResponse => {
  const [container, setContainer] = useState<HTMLDivElement>(element);
  const { state, setState } = useContext(AppContext);
  const { items, isDayTime } = state;

  let mounted = true;
  let cleanup: () => void;
  const loadMap = async () => {
    if (mounted) {
      const app = await import("../data/map");
      app.initialize(container);
      app.listenForLocate(setState);
      cleanup = app.cleanup;
      app.watchExtentChange(setState);
    }
  };

  const addItemsToMap = async () => {
    const app = await import("../data/map");
    app.addLocations(items);
  };

  const updateBasemap = async() => {
    const app = await import("../data/map");
    app.updateBasemapMode(isDayTime);
  };

  // load the map when the map
  // container is updated
  // from switching routes
  useEffect(
    () => {
      if (mounted && container) {
        loadMap();
      }
      return () => {
        mounted = false;
        if (cleanup) {
          cleanup();
        }
      };
    },
    [container]
  );

  useEffect(
    () => {
      // add new items to the
      // map layer as they are
      // updated
      addItemsToMap();
    },
    [items]
  );

  useEffect(
    () => {
      // if time changes from day to night
      // or vice versa, update basemap style
      updateBasemap();
    },
    [state.isDayTime]
  );

  return [container, setContainer];
};

export default useWebMap;
