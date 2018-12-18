import { open } from "esri/core/workers";
import { LatLon } from "../interfaces/common";
import esri = __esri;

let connection: esri.Connection;

export const findNearbyPlaces = async (latLon: LatLon) => {
  // open local worker to find nearby places
  if (!connection) {
    connection = await open("workerScripts/places");
  }
  // invoke the find method in our worker
  return connection.invoke("nearby.find", latLon);
};
