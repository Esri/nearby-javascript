import nprogress from "nprogress";
import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";

import { Category, LatLon, NearbyItem } from "../interfaces/common";

const KEY = "arcgis-nearby-places";

const emptyItems = [
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  },
  {
    address: "...",
    name: "...",
    type: "",
    location: { x: 0, y: 0 },
    bearing: "",
    distance: 0,
    icon: ""
  }
];

type useNearbyResponse = [NearbyItem[], (a: LatLon, b: Category[]) => Promise<NearbyItem[]>];

/**
 * Hook to find nearby places from lat/lon and list of categories
 * @param latLon 
 * @param categories 
 */
const useNearby = (latLon: LatLon, categories: Category[]): useNearbyResponse => {
  const [cache, setCache] = useLocalStorage(KEY);
  const initialItems = (cache && cache.length) ? cache : emptyItems;

  const [items, setItems] = useState<NearbyItem[]>(initialItems);

  const fetchNearbyItems = async (latlon: LatLon, placeCategories: Category[]) => {
    nprogress.start();
    const categorylist = placeCategories.filter(x => x.selected).map(x => x.name);
    const { findNearbyPlaces } = await import("../data/places");
    const results = await findNearbyPlaces(latlon, categorylist);
    const { asNearByItem } = await import("../utils/nearby");
    const nearbyItems = results.map(asNearByItem(latlon));
    // clear any current routes that might be displayed on the map
    const directions = await import("../data/routing");
    directions.clearDirections();
    setCache(nearbyItems);
    setItems(nearbyItems);
    nprogress.done();
    return nearbyItems;
  };

  useEffect(
    () => {
      if (latLon.latitude !== 0 && latLon.longitude !== 0) {
        fetchNearbyItems(latLon, categories);
      }
    },
    [latLon]
  );

  return [items, fetchNearbyItems];
};

export default useNearby;
