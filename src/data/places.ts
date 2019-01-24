import Point from "esri/geometry/Point";
import Locator from "esri/tasks/Locator";
import { geocodeURL } from "../config";
import { LatLon } from "../interfaces/common";
import { categoryForFoodType } from "../utils/iconType";

const geocoder = new Locator({ url: geocodeURL });

/**
 * Use the Locator to search for nearby places
 * with a given lat lon and categories
 */
export const findNearbyPlaces = async (latLon: LatLon, categories: string[]) => {
  const { latitude, longitude } = latLon;
  const point = new Point({ longitude, latitude });

  return geocoder
    .addressToLocations({
      location: point,
      distance: 50,
      categories,
      maxLocations: 20,
      outFields: ["Place_addr", "PlaceName", "Phone", "URL", "Type"]
    } as any)
    .then(results => {
      return results
        // do a client side filter of results
        // for example, Pizza is a sub-category of Food,
        // but user may want to filter Pizza results out
        .filter(result => {
          const type = result.attributes.Type;
          const category = categoryForFoodType(type);
          return categories.indexOf(category) > -1;
        })
        .map(result => {
        return {
          ...result.toJSON(),
          location: {
            latitude: result.location.latitude,
            longitude: result.location.longitude
          }
        };
      });
    });
};
