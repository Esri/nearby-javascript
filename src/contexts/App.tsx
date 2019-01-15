import { navigate } from "@reach/router"
// import nprogress from "nprogress";
import React, { createContext, useEffect, useReducer } from "react";
import useGeolocation from "../hooks/useGeolocation";
import useNearby from "../hooks/useNearby";
import { isDay } from "../utils/dateUtil";

import { AppPosition, AppState, Category, LatLon, NearbyItem } from "../interfaces/common";

export interface ContextProps {
  state: AppState;
  setState: React.Dispatch<{}>;
}

export interface AppProviderProps {
  children: JSX.Element[];
  location: Location;
}

const defaultCategories: Category[] = [
  {
    name: "Coffee Shop",
    selected: true
  },
  {
    name: "Food",
    selected: true
  },
  {
    name: "Pizza",
    selected: true
  },
  {
    name: "Hotel",
    selected: true
  }
]

const initialState = {
  categories: defaultCategories,
  mode: "list",
  mounted: false,
  isDayTime: isDay(new Date()),
  items: [],
  redoSearch: false,
  showFilter: false,
  showNotification: false
};

export const AppContext = createContext<ContextProps>({
  state: initialState,
  setState: (val: any) => val
});

export const AppProvider = ({ children, location }: AppProviderProps) => {
  const [latLon] = useGeolocation();
  const [items, fetchNearbyItems] = useNearby(latLon as LatLon, defaultCategories);
  const [state, setState] = useReducer<AppState, {}>(
    (currentState, newState) => ({ ...currentState, ...newState }),
    {
      ...initialState,
      items
    }
  );

  const getNearby = () => {
    if (
      (latLon as LatLon).latitude !== 0 &&
      (latLon as LatLon).longitude !== 0
    ) {
      setState({
        position: {
          type: "point",
          latitude: (latLon as LatLon).latitude,
          longitude: (latLon as LatLon).longitude
        },
        items
      });
    }
  };

  const selectNearbyItem = async () => {
    if (state.mode === "list") {
      navigate("/map");
    }
    const app = await import("../data/map");
    app.selectLocation(state.currentNearbyItem as NearbyItem);
  };

  // when an item is selected from the list
  // navigate to the map and select it
  useEffect(
    () => {
      if (state.currentNearbyItem) {
        selectNearbyItem();
      }
    },
    [ state.currentNearbyItem ]
  );

  // when the items, latLong or
  // mounted value are true, let's
  // call the nearby method
  useEffect(
    () => {
      if (state.mounted) {
        getNearby();
      }
      // nprogress.done();
    },
    [state.mounted, latLon, items]
  );

  // when a new position has been requested
  // fetch a new list of nearby items
  useEffect(
    () => {
      const { categories, position, redoSearch } = state;
      // verify that the position is not the same as the previous one
      if (
        position &&
        latLon &&
        (position as AppPosition).latitude !== (latLon as LatLon).latitude &&
        (position as AppPosition).longitude !== (latLon as LatLon).longitude
      ) {
        fetchNearbyItems(position, categories);
      }
      else if (redoSearch) {
        fetchNearbyItems(state.currentPosition as AppPosition, categories);
        setState({ redoSearch: false });
      }
      // nprogress.done();
    },
    [state.position, state.redoSearch]
  );

  const value = {
    state,
    setState
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
