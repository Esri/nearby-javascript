import { init, once, whenFalseOnce, whenOnce, whenTrueOnce } from "esri/core/watchUtils";
import VectorTileLayer from "esri/layers/VectorTileLayer";
import ArcGISMap from "esri/Map";
import MapView from "esri/views/MapView";
import Locate from "esri/widgets/Locate";

import { verifyUserSignedIn } from "../utils/credentials";
import { isDay } from "../utils/dateUtil";
import { nearbyLayer } from "./layers";

import esri = __esri;
import { AppPosition, NearbyItem } from '../interfaces/common';

const vtUrlDay = "https://www.arcgis.com/sharing/rest/content/items/63c47b7177f946b49902c24129b87252/resources/styles/root.json";
const vtUrlNight = "https://www.arcgis.com/sharing/rest/content/items/86f556a2d1fd468181855a35e344567f/resources/styles/root.json";

const url = isDay(new Date()) ? vtUrlDay : vtUrlNight;

const baseVectorTileLayer = new VectorTileLayer({ url });

let mapLoaded = false;

export const webmap = new ArcGISMap({
  basemap: {
    baseLayers: [baseVectorTileLayer]
  },
  layers: [nearbyLayer]
});

export const view = new MapView({
  map: webmap,
  center: [-116.5, 33.8],
  scale: 50000,
  padding: { left: 0, top: 60, right: 0, bottom: 0 },
  ui: {
    components: ["attribution", "zoom", "compass"]
  },
  popup: {
    collapseEnabled: false,
    actions: []
  }
});

let center: esri.Point;

export const locate = new Locate({ view, scale: 9000 });

view.ui.add(locate, "top-left");

let routing: any;

let popActionListening = false;

export const listenForPopupActions = (updateCurrentRoute: (a: { currentRoute: {
  name: string,
  directions: esri.DirectionsFeatureSet
} , showDirections: boolean }) => void) => {
  if (!popActionListening) {
    view.popup.on("trigger-action", async ({ action }) => {
      // only handle directions action
      if (action.id !== "directions") {
        return;
      }
      if (!verifyUserSignedIn()) {
        return alert("Please Sign In to use Directions");
      }
      if (!routing) {
        routing = await import("./routing");
      }
      const route = await routing.getDirections({
        // clone the graphics
        // so originals are not modified
        start: locate.graphic.clone(),
        stop: view.popup.selectedFeature.clone(),
        view
      });
      if (route) {
        const { directions } = route;
        updateCurrentRoute({ currentRoute: {
          directions,
          name: view.popup.selectedFeature.attributes.name
        }, showDirections: true });
      }
    });
    popActionListening = true;
  }
};

let locateHandler: IHandle | null;

interface ListenForLocateProps { position?: AppPosition, hasGeolocationPermission?: boolean };

export const listenForLocate = (update: (a: ListenForLocateProps) => void) => {
  if (!locateHandler) {
    locateHandler = locate.on("locate", (result: Position) => {
      mapLoaded = true;
      const { latitude, longitude } = result.coords;
      update({
        position: {
          type: "point",
          latitude, longitude
        }
      });
    });
    locate.on("locate-error", (error) => {
      // permission probably denied or not https
      if (error.code && (error.code === 1 || error.code === 2)) {
        mapLoaded = true;
        // since permission denied or not https
        // remove the widget from the view
        view.ui.remove(locate);
        update({
          hasGeolocationPermission: false
        });
        alert("Search the map to find nearby places");
      }
    });
  }
};

export const initialize = async (container: HTMLDivElement) => {
  if (center) {
    view.center = center;
  }
  view.container = container;

  try {
    if (!center && locate.viewModel.state === "disabled") {
      const handle = init(locate, "viewModel.state", async (state) => {
        if (state === "ready") {
          handle.remove();
          locate.locate();
        }
      });
    } else if (!center && locate.viewModel.state === "ready") {
      locate.locate();
    }
  }
  catch {}

  return view;
};

export const cleanup = () => {
  center = view.center;
  (view.container as any) = null;
  if (locateHandler) {
    locateHandler.remove();
    locateHandler = null;
  }
};

const currentItems: string[] = [];

const nearbyItemMappedAsKey =
  (item: NearbyItem, idx: number) => `${item.name}-${item.address}-${idx}`;

export const addLocations = async (items: NearbyItem[]) => {
  // verify we are only updating new items
  if (currentItems.length) {
    const incomingItems = items.map(nearbyItemMappedAsKey);
    if (currentItems.every((item, idx) => {
      return item === incomingItems[idx];
    })) {
      return;
    }
  }
  // empty the current items
  currentItems.length = 0;

  // Create the features that will be added to
  // the nearby layer
  const addFeatures = items.map((item, idx) => {
    currentItems.push(nearbyItemMappedAsKey(item, idx));
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
  // close popup when new nearby items are added/removed
  view.popup.close();
};

// Query the item from the Layer
// switch to the map and open the popup
// and zoom to that feature
export const selectLocation = async (item: NearbyItem) => {
  await whenOnce(view, "ready");
  const layerView = await view.whenLayerView(nearbyLayer) as esri.FeatureLayerView;
  if (layerView.updating) {
    await whenFalseOnce(layerView, "updating");
  }
  try {
    const query = nearbyLayer.createQuery();
    query.where = `address='${item.address}' AND name='${item.name.replace("'", "''")}'`;
    const { features } = await layerView.queryFeatures(query);
    view.popup.open({
      location: features[0].geometry,
      features
    });
    await view.goTo(features);
  } catch {}

};

export const updateBasemapMode = (isDayTime: boolean) => {
  const style = isDayTime ? vtUrlDay : vtUrlNight;
  // verify that that the layer is loaded
  // and the style is currently different
  if (
    baseVectorTileLayer.loaded &&
    (baseVectorTileLayer.currentStyleInfo.styleUrl !== style)
    ) {
      const color = isDayTime ? "black" : "white";
      baseVectorTileLayer.loadStyle(style);
      updateNearbyLayerSymbols(color as any);
  }
}

export const updateNearbyLayerSymbols = (color: esri.Color) => {
  const renderer = (nearbyLayer.renderer as esri.UniqueValueRenderer).clone();
  // update the color of the symbols in the renderer
  renderer.uniqueValueInfos.forEach(info => {
    (info.symbol as esri.SimpleMarkerSymbol).color = color;
  });
  nearbyLayer.renderer = renderer;
}

interface UpdateExtentChangeProps {
  currentPosition?: AppPosition,
  showNotification?: boolean
}

export const watchExtentChange = async (update: (a: UpdateExtentChangeProps) => void) => {
  await once(view, "extent");
  const { latitude, longitude } = view.center;
  update({
    currentPosition: {
      type: "point",
      latitude, longitude
    }
  })

  await whenTrueOnce(view, "stationary");
  // only want the notification to show
  // if the map has already been loaded
  // and the map is currently displayed
  if (view && view.center) {
    const isReady = mapLoaded && !!view.container;
    const props: UpdateExtentChangeProps = {
      showNotification: isReady,
      currentPosition: {
        type: "point",
        latitude: view.center.latitude,
        longitude: view.center.longitude
      }
    };
    update(props);
  }
 
  watchExtentChange(update);
};
