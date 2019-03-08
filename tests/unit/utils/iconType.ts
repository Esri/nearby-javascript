/// <reference types="intern" />

const { describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

import { iconType } from "../../../src/utils/iconType";

describe("utils/iconType", () => {
  describe("iconType", () => {
    it("should return correct icon type for given value", () => {
      expect(iconType()).to.eq("help");
      expect(iconType("Swiss Food")).to.eq("local_dining");
    });
  });
});
