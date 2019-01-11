import DirectionsViewModel from "esri/widgets/Directions/DirectionsViewModel";

import { appId, portalUrl } from "../config";
import { initialize } from "./oauth";

import esri = __esri;

const directionsVM = new DirectionsViewModel();

export interface RouteDirectionsProps {
  start: esri.Graphic,
  stop: esri.Graphic,
  view: esri.MapView
}

export const getDirections = async ({ start, stop, view }: RouteDirectionsProps) => {
  // set up authentication if it is valid
  initialize(appId as string, portalUrl);
  directionsVM.view = view;
  // loading the directions view model will require
  // being logged in to your application
  await (directionsVM as any).load();
  directionsVM.stops.removeAll();
  directionsVM.stops.addMany([start, stop]);
  // find the 'Waling Time' travel mode of the widget
  const walkingTravelMode = directionsVM.travelModes.find(mode => mode.name === "Walking Time");
  if (walkingTravelMode) {
    (directionsVM as any).selectedTravelMode = walkingTravelMode;
  }
  const routeResult = await directionsVM.getDirections();
  return routeResult;
}

export const clearDirections = () => {
  directionsVM.reset();
};