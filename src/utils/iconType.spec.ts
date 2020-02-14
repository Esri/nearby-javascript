import { iconType } from "./iconType";

describe("utils/iconType", () => {
  describe("iconType", () => {
    it("should return correct icon type for given value", () => {
      expect(iconType()).toBe("help");
      expect(iconType("Swiss Food")).toBe("local_dining");
    });
  });
});
