import Point from "esri/geometry/Point";
import Locator from "esri/tasks/Locator";
import { LatLon } from "../interfaces/common";

const geocoder = new Locator({
  url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
});

export const nearby = {
  find: ({ latitude, longitude }: LatLon) => {
    const point = new Point({ longitude, latitude });

    return geocoder
      .addressToLocations({
        location: point,
        distance: 50,
        categories: ["Coffee shop", "Gas station", "Food", "Hotel"],
        maxLocations: 20,
        outFields: ["Place_addr", "PlaceName", "Type"]
      } as any)
      .then(results => {
        return results.map(result => {
          return {
            ...result.toJSON(),
            location: {
              latitude: result.location.latitude,
              longitude: result.location.longitude
            }
          };
        });
      });
  }
};
