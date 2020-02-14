
import { bearings } from "./bearings";

describe("utils/bearings", () => {
  describe("bearings", () => {
    it("calculate the bearings between two points", () => {
      // start
      const startLat = 34.052235;
      const startLon = -118.243683;

      // N
      const nLat = 34.082282;
      const nLon = -118.244181;
      const nDirection = bearings(startLat, startLon, nLat, nLon);

      // NE
      const neLat = 34.072329;
      const neLon = -118.209864;
      const neDirection = bearings(startLat, startLon, neLat, neLon);

      // E
      const eLat = 34.056686;
      const eLon = -118.212266;
      const eDirection = bearings(startLat, startLon, eLat, eLon);

      // SE
      const seLat = 34.037417;
      const seLon = -118.217776;
      const seDirection = bearings(startLat, startLon, seLat, seLon);

      // S
      const sLat = 34.043032;
      const sLon = -118.242465;
      const sDirection = bearings(startLat, startLon, sLat, sLon);

      // SW
      const swLat = 34.03848;
      const swLon = -118.263399;
      const swDirection = bearings(startLat, startLon, swLat, swLon);

      // W
      const wLat = 34.056686;
      const wLon = -118.267517;
      const wDirection = bearings(startLat, startLon, wLat, wLon);

      // NW
      const nwLat = 34.083493;
      const nwLon = -118.283322;
      const nwDirection = bearings(startLat, startLon, nwLat, nwLon);

      expect(nDirection).toBe("N");
      expect(neDirection).toBe("NE");
      expect(eDirection).toBe("E");
      expect(seDirection).toBe("SE");
      expect(sDirection).toBe("S");
      expect(swDirection).toBe("SW");
      expect(wDirection).toBe("W");
      expect(nwDirection).toBe("NW");
    });
  });
});
