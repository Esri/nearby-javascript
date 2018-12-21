import DirectionsViewModel from "esri/widgets/Directions/DirectionsViewModel";

import esri = __esri;

const directionsVM = new DirectionsViewModel();

export interface RouteDirectionsProps {
  start: esri.Graphic,
  stop: esri.Graphic,
  view: esri.MapView
}

export const getDirections = async ({ start, stop, view }: RouteDirectionsProps) => {
  directionsVM.view = view;
  await (directionsVM as any).load();
  directionsVM.stops.removeAll();
  directionsVM.stops.addMany([start, stop]);
  const routeResult = await directionsVM.getDirections();
  return routeResult;
}