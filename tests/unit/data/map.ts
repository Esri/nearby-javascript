/// <reference types="intern" />

const { after, before, describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

import { stub } from "sinon";
import { nearbyLayer } from "../../../src/data/layers";
import { addLocations, initialize, locate, view } from "../../../src/data/map";

describe("data/map", () => {
  describe("initialize", () => {
    let locateStub: any;

    before(() => {
      locateStub = stub(locate, "locate");
    });

    after(() => {
      locateStub.restore();
    });

    it("should initialize the mapview", () => {
      const element = document.createElement("div");
      initialize(element);
      expect(view.container).to.eq(element);
    });
  });

  describe("addLocations", () => {
    let queryOIDStub: any;
    let applyEditsStub: any;
    let viewWhenStub: any;
    let viewGoToStub: any;
    let realNearbyLayer: any;

    before(() => {
      realNearbyLayer = nearbyLayer;
      queryOIDStub = stub(nearbyLayer, "queryObjectIds");
      applyEditsStub = stub(nearbyLayer, "applyEdits");
      viewWhenStub = stub(view, "when");
      viewGoToStub = stub(view, "goTo");

      queryOIDStub.resolves([1, 2, 3]);
      applyEditsStub.resolves({ success: true });
      viewWhenStub.resolves();
      viewGoToStub.resolves();
    });

    after(() => {
      (nearbyLayer as any) = realNearbyLayer;
      queryOIDStub.restore();
      applyEditsStub.restore();
      viewWhenStub.restore();
      viewGoToStub.restore();
    });

    it("should add results as graphics to the map", async () => {
      const item = {
        name: "test",
        address: "221B Baker St",
        icon: "food",
        location: {
          x: 22,
          y: 41
        }
      };

      await addLocations([item as any]);
      expect(queryOIDStub.called).to.eq(true);
      expect(applyEditsStub.called).to.eq(true);
    });
  });
});
