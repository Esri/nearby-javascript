/// <reference types="intern" />

const { describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

import { asNearByItem } from "../../../src/utils/nearby";

import esri = __esri;

describe("data/nearby", () => {
  describe("asNearbyItem", () => {
    const coords = {
      latitude: 22,
      longitude: 41
    };
    const candidate = {
      attributes: {
        Place_addr: "221B Baker St",
        PlaceName: "Tacos",
        Type: "food"
      },
      location: {
        latitude: 23,
        longitude: 42
      }
    };

    it("should convert coords and candidate to a NearbyItem", () => {
      const item = asNearByItem(coords as Coordinates)(
        candidate as esri.AddressCandidate
      );
      expect(item.location.x).to.eq(candidate.location.longitude);
      expect(item.location.y).to.eq(candidate.location.latitude);
      expect(item.address).to.eq(candidate.attributes.Place_addr);
      expect(item.name).to.eq(candidate.attributes.PlaceName);
      expect(item.type).to.eq(candidate.attributes.Type);
    });
  });
});
