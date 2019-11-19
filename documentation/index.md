## Description

Customize your exploration of places around you using the [ArcGIS World Geocoding Service](https://developers.arcgis.com/features/geocoding/) or your own [custom geocoding service](https://doc.arcgis.com/en/arcgis-online/reference/geocode.htm#ESRI_SECTION1_CD53FF34D6A54AB8880A3AE98F805F74). Nearby Places uses Esri’s geocoding service to find hotels, restaurants, or coffee shops within a default radius of the device’s current location and, upon signing in, provides routing directions to a selected place of interest. The ArcGIS API for JavaScript [Geometry Engine](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html) is used to sort the list of places based on distance and bearing from the device’s location.

Grab the code and either configure the app for your organization, or just learn how to integrate similar capabilities into your own app!

### Functionality showcased

* Mobile-first design
* Geocoding with categories
* Getting device location
* Calculating bearing and distance
* Automatic switching of basemap and renderer based on time of day
* Built as a [Progressive Web App](https://developers.google.com/web/progressive-web-apps/)

This application takes advantage of numerous technologies for development purposes. It is mainly designed for mobile devices. It utilizes [webpack](https://webpack.js.org/) to compile and bundle the application code and other files. It is written in [TypeScript](http://www.typescriptlang.org/) and is built using [React](https://reactjs.org/), [React hooks](https://reactjs.org/docs/hooks-intro.html) and [custom React hooks](https://reactjs.org/docs/hooks-custom.html).

This application also uses [Workbox for Webpack](https://developers.google.com/web/tools/workbox/get-started/webpack) to set up [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) for the application to cache application code and files, as well as uses an [appcache fallback](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache) for Internet Explorer, Edge, and Safari.

[Intern](https://theintern.io/) is used for all unit tests.

Feel free to use this project as a starting point for your own applications!

<img src="/images/application.png" width="600"  />

## Progressive web app

There are various techniques used in this application to create a fast, responsive, and application-like experience to meet the requirements of modern [progressive web apps](https://developers.google.com/web/progressive-web-apps/).

It uses the [app shell model](https://developers.google.com/web/fundamentals/architecture/app-shell) to provide a default user interface until the application is able to load the required files and data.

It registers a [service worker](https://developers.google.com/web/fundamentals/primers/service-workers/) to cache application files.

It also uses [webpack](https://webpack.js.org/) to compile and bundle the application code and other files. The application takes advantage of this by dynamically loading code as needed, which leads to fast application load times and a more responsive user experience.

## Identifying places nearby

### Device location

The Nearby App uses a _mapless app pattern_ by first presenting a list of nearby places on a mobile device. Since the app starts with a list, rather than a map, the device location is obtained using the browsers [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API). When used on a desktop browser, the application loads both the list of places and the map.

The device location is provided via a [custom React hooks](https://reactjs.org/docs/hooks-custom.html).

```js
// src/hooks/useGeolocation.ts
import { useEffect, useState } from "react";

import { LatLon } from "../interfaces/common";

// custom react hook
const useGeolocation = () => {
  const [state, setState] = useState<LatLon>({
    latitude: 0,
    longitude: 0
  });

  let mounted = true;

  const locate = (latLon?: LatLon) => {
    if (latLon) {
      // can provide a default latitude and longitude
      setState(latLon);
    } else {
      // use the browsers geolocation API to get current position
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setState({ latitude, longitude });
      });
    }
  };

  useEffect(() => {
    if (mounted) {
      locate();
    }
    return () => {
      mounted = false;
    };
  }, []);
  return [state, locate];
};

export default useGeolocation;

```

Once a location is obtained, a search for places can begin.

### Geocoding

The search for places uses category filters (e.g. “Hotel”, “Food”, “Pizza”) to find places matching these types near the current device location. The World Geocoding Service uses a hierarchical structure of categories allowing high-level concepts, like a category level 1 descriptor (e.g. “POI” for place of interest) to be searched as well as more specific category level 3 types like “Brazilian Food” or “Science Museum” to be used. The category filters and other search criteria are defined using the Locator APIs [`addressToLocations`](https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-Locator.html#addressToLocations) method.

The geocode parameters are configured with the maximum number of results to return, the desired categories, the device's current location, and [output fields](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-service-output.htm#ESRI_SECTION1_42D7D3D0231241E9B656C01438209440) using the following pattern.  Note that the geocoding service supports a specific list of categories defined [here](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm#ESRI_SECTION1_502B3FE2028145D7B189C25B1A00E17B).  In the Nearby App, we're interested in the top 20 results within a radius of 50 kilometers of the current location.

```js
// src/data/places.ts
import Point from "esri/geometry/Point";
import Locator from "esri/tasks/Locator";
import { LatLon } from "../interfaces/common";

const geocoder = new Locator({
  url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
});

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
};
```

A distance and bearing from the device's location is calculated for each returned place.

### Calculating bearing and distance

To determine distance, the [geometry engine](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html) is used to calculate the [geodesic distance](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html#geodesicLength) between the device location and each nearby point of interest. Measuring distance, determining spatial relationships, and altering geometries can be done locally in the application.

Distances are calculated using a helper method in the application.

```js
// src/utils/nearby.ts
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
  candidate: esri.AddressCandidate,
  idx?: number
) => {
  const { attributes, location } = candidate;
  const item: NearbyItem = {
    OBJECTID: `${idx}`,
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
```

A utility method is provided in the application to calcuate bearings to each place from the device location.

```js
// src/utils/bearings.ts
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export const bearings = (
  startLatitude: number,
  startLongitude: number,
  stopLatitude: number,
  stopLongitude: number
) => {
  const dLon = toRad(stopLongitude - startLongitude);
  const y = Math.sin(dLon) * Math.cos(toRad(stopLatitude));
  const x =
    Math.cos(toRad(startLatitude)) * Math.sin(toRad(stopLatitude)) -
    Math.sin(toRad(startLatitude)) *
      Math.cos(toRad(stopLatitude)) *
      Math.cos(dLon);
  const degrees = toDeg(Math.atan2(y, x));

  if (degrees > -22.5 && degrees <= 22.5) {
    return "N";
  } else if (degrees > 22.5 && degrees <= 67.5) {
    return "NE";
  } else if (degrees > 67.5 && degrees <= 112.5) {
    return "E";
  } else if (degrees > 112.5 && degrees <= 157.5) {
    return "SE";
  } else if (degrees > 157.5 || degrees <= -157.5) {
    return "S";
  } else if (degrees > -157.5 && degrees <= -112.5) {
    return "SW";
  } else if (degrees > -112.5 && degrees <= -67.5) {
    return "W";
  } else {
    return "NW";
  }
};
```

With bearing and distance assigned, places are shown in a list. Clicking on the map icon on a mobile device will display the nearby places in the map view.

## Displaying places in the map

### Application routing

The application uses the [React Reach Router](https://reach.tech/router) to load the Map page. This loads the required files so that the nearby places are displayed on the map as markers in a [FeatureLayer](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html).

```ts
// src/contexts/App.ts

  // update the context state when the
  // route changes, a new geolocation
  // has been asked for or when the
  // nearby items have been updated
  useEffect(
    () => {
      nprogress.start();
      if (location.pathname === "/map") {
        setState({ mode: "map" });
      } else {
        setState({ mode: "list" });
      }
      getNearby();
    },
    [location, latLon, items]
  );
```

The nearby places are then added to a FeatureLayer with a custom source.

```ts
// src/data/map.ts
export const addLocations = async (items: NearbyItem[]) => {
  // verify we are only updating new items
  if (currentItems.length) {
    const incomingItems = items.map((item, idx) => `${item.address}-${idx}`);
    if (currentItems.every((item, idx) => {
      return item === incomingItems[idx];
    })) {
      return;
    }
  }
  // empty the current items
  currentItems.length = 0;

  // create the features that will be added to
  // the nearby layer
  const addFeatures = items.map((item, idx) => {
    currentItems.push(`${item.address}-${idx}`);
    return {
      attributes: item,
      geometry: {
        type: "point",
        x: item.location.x,
        y: item.location.y
      }
    } as any;
  });
  // remove the old features from the layer at the same time
  const oids = await nearbyLayer.queryObjectIds();
  const deleteFeatures = oids.map(oid => ({ objectId: oid }));
  await nearbyLayer.applyEdits({
    deleteFeatures, addFeatures
  });
};
```

### Refreshing the map view with new search results

As the user taps or pans the map, the app displays a `SnackBar` to offer the user the opportunity to perform a new search for the panned location. Navigation changes are monitored by watching for extent of the view to change and then waiting for the LayerView to finish updating.

```ts
// src/data/map.ts
export const watchExtentChange = (update: (a: UpdateExtentChangeProps) => void) => {
  // only listen for this change once
  once(view, "extent", () => {
    const { latitude, longitude } = view.center;
    // make the latest map center available
    // the to the application
    update({
      currentPosition: {
        type: "point",
        latitude, longitude
      }
    })
    whenTrueOnce(view, "stationary", () => {
      // only want the notification to show
      // if the map has already been loaded
      // and the map is currently displayed
      const isReady = mapLoaded && !!view.container;
      const props: UpdateExtentChangeProps = {
        showNotification: isReady
      };
      if (view && view.center) {
        props.currentPosition = {
          type: "point",
          latitude: view.center.latitude,
          longitude: view.center.longitude
        };
      }
      update(props);
      // recursively call this method again
      // to watch for the next extent change
      watchExtentChange(update);
    });
  });
};
```

If the user decides to perform a new search, then the application will perform a new search based on the current center of the map.

## Routing

A walking route is generated for a place by tapping on the _Get Directions_ [custom action button](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Popup.html#actions) in the Popup. The route to a location is determined using the [`DirectionsViewModel`](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Directions-DirectionsViewModel.html) in the API. This application does not utilize the entire [Directions widget](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Directions.html), only the view model. This application is designed specifically for walking directions, and the `DirectionsViewModel` provides a simple way to do this. Using the `DirectionsViewModel` will automatically draw the start and stop locations, and the route on the map for you.

```ts
// src/data/routing.ts
export const getDirections = async ({ start, stop, view }: RouteDirectionsProps) => {
  // set up authentication if it is valid
  initialize(appId as string, portalUrl);
  directionsVM.view = view;
  // loading the directions view model will require
  // being signed in to your application
  await (directionsVM as any).load();
  directionsVM.stops.removeAll();
  directionsVM.stops.addMany([start, stop]);
  // find the 'Walking Time' travel mode of the widget
  const walkingTravelMode = directionsVM.travelModes.find(mode => mode.name === "Walking Time");
  if (walkingTravelMode) {
    (directionsVM as any).selectedTravelMode = walkingTravelMode;
  }
  const routeResult = await directionsVM.getDirections();
  return routeResult;
}
```

## Identity

The Maps App leverages the ArcGIS [identity](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/) model to provide access to resources via the [named user](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/#named-user-login) login pattern.

To access Routing, you must sign in via the provided Authentication button in the toolbar. Once signed in, you will be able to get directions from the device location to a selected location.

The application ID is defined in a couple of `.env` files in the application - one for development and one for production. Once you have registered your application, copy the client id and create two files in the `env/` folder.

 - `env/development.env`
 - `env/production.env`

 In these files you can define the application ID for both environments for your application.

 ```
 # env/development.env
 ARCGIS_APP_ID=THISisMYdevelopmentID
 ```

  ```
 # env/production.env
 ARCGIS_APP_ID=THISisMYproductionID
 ```

 The application ID will be injected into your application during the webpack build process using the [dotenv-webpack](https://github.com/mrsteele/dotenv-webpack#readme) plugin. Although you can whitelist your application ID to various domains, it still a good practice to not check these `.env` files into your git repo. The application git repo is already set up to ignore these files.

* You will also want to provide the Portal URL for your Organization, such as `"https://<MY-ORGANIZATION>.maps.arcgis.com"` in the `src/config.ts` file.

```js
// src/config.ts
export const appId = process.env.ARCGIS_APP_ID;

/**
 * Users Portal URL.
 */
export const portalUrl = "https://www.arcgis.com"; // default Portal URL
```

