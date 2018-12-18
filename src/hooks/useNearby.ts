import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";

import { LatLon, NearbyItem } from "../interfaces/common";

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

type useNearbyResponse = [NearbyItem[], (a: LatLon) => Promise<void>];

const useNearby = (latLon: LatLon): useNearbyResponse => {
  const [cache, setCache] = useLocalStorage(KEY);
  const initialItems = (cache && cache.length) ? cache : emptyItems;

  const [items, setItems] = useState<NearbyItem[]>(initialItems);

  const fetchNearbyItems = async (latlon: LatLon) => {
    const { findNearbyPlaces } = await import("../data/places");
    const results = await findNearbyPlaces(latlon);
    const { asNearByItem } = await import("../utils/nearby");
    const nearbyItems = results.map(asNearByItem(latlon));
    setCache(nearbyItems);
    setItems(nearbyItems);
  };

  useEffect(
    () => {
      if (latLon.latitude !== 0 && latLon.longitude !== 0) {
        fetchNearbyItems(latLon);
      }
    },
    [latLon]
  );

  return [items, fetchNearbyItems];
};

export default useNearby;
