import { navigate } from "@reach/router"
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
    name: "Bar or Pub",
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

export const AppContext = createContext<ContextProps>({
  state: {
    categories: defaultCategories,
    mode: "list",
    isDayTime: isDay(new Date()),
    items: [],
    redoSearch: false,
    showFilter: false,
    showNotification: false
  },
  setState: (val: any) => val
});

export const AppProvider = ({ children, location }: AppProviderProps) => {
  const [latLon] = useGeolocation();
  const [items, fetchNearbyItems] = useNearby(latLon as LatLon, defaultCategories);
  const [state, setState] = useReducer<AppState, {}>(
    (currentState, newState) => ({ ...currentState, ...newState }),
    {
      categories: defaultCategories,
      mode: "list",
      items,
      isDayTime: isDay(new Date()),
      redoSearch: false,
      showFilter: false,
      showNotification: false
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
    navigate("/map");
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

  // update the conext state when the
  // route changes, a new geolocation
  // has been asked for or when the
  // nearby items have been updated
  useEffect(
    () => {
      if (location.pathname === "/map") {
        setState({ mode: "map" });
      } else {
        setState({ mode: "list" });
      }
      getNearby();
    },
    [location, latLon, items]
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
        fetchNearbyItems(position as AppPosition, categories);
        setState({ redoSearch: false });
      }
    },
    [state.position, state.redoSearch]
  );

  const value = {
    state,
    setState
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
