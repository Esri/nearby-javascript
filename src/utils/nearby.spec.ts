import { asNearByItem } from "./nearby";

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
      expect(item.location.x).toEqual(candidate.location.longitude);
      expect(item.location.y).toEqual(candidate.location.latitude);
      expect(item.address).toEqual(candidate.attributes.Place_addr);
      expect(item.name).toEqual(candidate.attributes.PlaceName);
      expect(item.type).toEqual(candidate.attributes.Type);
    });
  });
});
