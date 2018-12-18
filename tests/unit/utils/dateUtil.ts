/// <reference types="intern" />

const { describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

import { isDay } from "../../../src/utils/dateUtil";

describe("utils/dateUtil", () => {
  describe("isDate", () => {
    it("should determine if time of day is day or night", () => {
      const day = "Tue Dec 18 2018 12:00:00 GMT-0800 (Pacific Standard Time)";
      const night = "Tue Dec 18 2018 20:00:00 GMT-0800 (Pacific Standard Time)";

      expect(isDay(new Date(day))).to.equal(true);
      expect(isDay(new Date(night))).to.equal(false);
    });
  });
});
