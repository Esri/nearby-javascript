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

view.popup.on("trigger-action", async ({ action }) => {
  if (!verifyUserSignedIn()) {
    return alert("Please Sign In to use Directions");
  }
  if (!routing) {
    routing = await import("./routing");
  }
  routing.getDirections({
    start: locate.graphic,
    stop: view.popup.selectedFeature,
    view
  });
});

let locateHandler: IHandle | null;

export const listenForLocate = (updatePosition: (a: { position: AppPosition }) => void) => {
  if (!locateHandler) {
    locateHandler = locate.on("locate", (result: Position) => {
      mapLoaded = true;
      const { latitude, longitude } = result.coords;
      updatePosition({
        position: {
          type: "point",
          latitude, longitude
        }
      });
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

  // Create the features that will be added to
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
    query.where = `address='${item.address}' AND name='${item.name}'`;
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

export const watchExtentChange = (update: (a: UpdateExtentChangeProps) => void) => {
  once(view, "extent", () => {
    const { latitude, longitude } = view.center;
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
      watchExtentChange(update);
    });
  });
};
