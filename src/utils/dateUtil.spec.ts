import { isDay } from "./dateUtil";

describe("utils/dateUtil", () => {
  describe("isDate", () => {
    it("should determine if time of day is day or night", () => {
      const day = "Tue Dec 18 2018 12:00:00 GMT-0800 (Pacific Standard Time)";
      const night = "Tue Dec 18 2018 20:00:00 GMT-0800 (Pacific Standard Time)";

      expect(isDay(new Date(day))).toBeTruthy();
      expect(isDay(new Date(night))).toBeFalsy();
    });
  });
});
