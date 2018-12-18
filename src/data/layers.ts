import FeatureLayer from "esri/layers/FeatureLayer";
import { svgSymbol, svgSymbolMap } from "../utils/symbols";

const fields = [
  {
    name: "OBJECTID",
    alias: "OBJECTID",
    type: "oid"
  },
  {
    name: "address",
    alias: "Address",
    type: "string"
  },
  {
    name: "bearing",
    alias: "Bearing",
    type: "string"
  },
  {
    name: "distance",
    alias: "Distance",
    type: "double"
  },
  {
    name: "icon",
    alias: "Icon",
    type: "string"
  },
  {
    name: "name",
    alias: "Name",
    type: "string"
  },
  {
    name: "type",
    alias: "Type",
    type: "string"
  }
];

const popupTemplate = {
  title: "{name}",
  content: "{address}"
};

const uniqueValueInfos = [];

for (const value in svgSymbolMap) {
  if (value) {
    uniqueValueInfos.push({
      value,
      symbol: svgSymbol(value)
    });
  }
}

const renderer: any = {
  type: "unique-value",
  field: "icon",
  symbol: svgSymbol("default"),
  uniqueValueInfos
};

export const nearbyLayer = new FeatureLayer({
  id: "nearby-places",
  title: "Nearby Places",
  geometryType: "point",
  source: [],
  fields,
  objectIdField: "OBJECTID",
  renderer,
  popupTemplate
});
