import { Polyline } from "esri/geometry";
import { geodesicLength } from "esri/geometry/geometryEngine";

import { bearings } from "./bearings";
import { iconType } from "./iconType";

import { LatLon, NearbyItem } from "../interfaces/common";

import esri = __esri;

export const distanceBetweenTwoPoints = (
  pointA: LatLon,
  pointB: LatLon
) => {
  const line = new Polyline({
    paths: [
      [pointA.longitude, pointA.latitude],
      [pointB.longitude, pointB.latitude]
    ] as any
  });

  return geodesicLength(line, "miles");
};

export const asNearByItem = (latLon: LatLon) => (
  candidate: esri.AddressCandidate
) => {
  const { attributes, location } = candidate;
  const item: NearbyItem = {
    address: attributes.Place_addr,
    name: attributes.PlaceName,
    phone: attributes.Phone,
    url: attributes.URL,
    type: attributes.Type,
    location: {
      x: location.longitude,
      y: location.latitude
    },
    bearing: bearings(
      latLon.latitude,
      latLon.longitude,
      location.latitude,
      location.longitude
    ),
    distance: distanceBetweenTwoPoints(
      { latitude: latLon.latitude, longitude: latLon.longitude },
      { latitude: location.latitude, longitude: location.longitude }
    ),
    icon: iconType(attributes.Type)
  };
  return item;
};
