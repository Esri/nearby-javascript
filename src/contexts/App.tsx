import { navigate } from "@reach/router"
import React, { createContext, useEffect, useReducer } from "react";
import useGeolocation from "../hooks/useGeolocation";
import useNearby from "../hooks/useNearby";
import { isDay } from "../utils/dateUtil";

import { AppPosition, AppProviderProps, AppState, Category, ContextProps, LatLon, NearbyItem } from "../interfaces/common";


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

const initialState: AppState = {
  categories: defaultCategories,
  mode: "list",
  mounted: false,
  isDayTime: isDay(new Date()),
  items: [],
  redoSearch: false,
  showFilter: false,
  showNotification: false
};

// main application context
export const AppContext = createContext<ContextProps>({
  state: initialState,
  setState: (val: any) => val
});

// main application provider
export const AppProvider = ({ children }: AppProviderProps) => {
  const [latLon] = useGeolocation();
  const [items, fetchNearbyItems] = useNearby(latLon as LatLon, defaultCategories);
  const reducer: (a: AppState, b: AppState) => AppState = (currentState, newState) => ({ ...currentState, ...newState });
  const init: (a: AppState) => AppState = initState => ({ ...initState, items });
  const [state, setState] = useReducer(
    reducer,
    initialState,
    init
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
    // in this case, it's possible that geolocation permission was denied
    // so continue to treat the currentPosition as the latest Position
    else if (
      state.currentPosition &&
      state.currentPosition.latitude !== 0 &&
      state.currentPosition.longitude !== 0
    ) {
      setState({
        position: {
          type: "point",
          latitude: state.currentPosition.latitude,
          longitude: state.currentPosition.longitude
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
    },
    [state.mounted, latLon, items]
  );

  // when a new position has been requested
  // fetch a new list of nearby items
  useEffect(
    () => {
      const { categories, hasGeolocationPermission, position, redoSearch } = state;
      // verify that the position is not the same as the previous one
      if (
        hasGeolocationPermission &&
        position &&
        latLon &&
        position.latitude !== (latLon as LatLon).latitude &&
        position.longitude !== (latLon as LatLon).longitude
      ) {
        fetchNearbyItems(position, categories);
      }
      else if (redoSearch) {
        fetchNearbyItems(state.currentPosition as AppPosition, categories);
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
