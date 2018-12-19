import React, { createContext, useEffect, useReducer } from "react";
import useGeolocation from "../hooks/useGeolocation";
import useNearby from "../hooks/useNearby";
import { isDay } from "../utils/dateUtil";

import { AppPosition, AppState, LatLon } from "../interfaces/common";

export interface ContextProps {
  state: AppState;
  setState: React.Dispatch<{}>;
}

export interface AppProviderProps {
  children: JSX.Element[];
  location: Location;
}

export const AppContext = createContext<ContextProps>({
  state: {
    mode: "list",
    isDayTime: isDay(new Date()),
    items: []
  },
  setState: (val: any) => val
});

export const AppProvider = ({ children, location }: AppProviderProps) => {
  const [latLon] = useGeolocation();
  const [items, fetchNearbyItems] = useNearby(latLon as LatLon);
  const [state, setState] = useReducer<AppState, {}>(
    (currentState, newState) => ({ ...currentState, ...newState }),
    {
      mode: "list",
      items,
      isDayTime: isDay(new Date())
    } as any
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
      const { position } = state;
      // verify that the position is not the same as the previous one
      if (
        position &&
        latLon &&
        (position as AppPosition).latitude !== (latLon as LatLon).latitude &&
        (position as AppPosition).longitude !== (latLon as LatLon).longitude
      ) {
        fetchNearbyItems(position);
      }
    },
    [state.position]
  );

  const value = {
    state,
    setState
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
