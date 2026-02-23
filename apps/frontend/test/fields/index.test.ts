import { expect, describe, it } from "vitest";
import { pageField, searchFieldExtend } from "../../src/schemas/fields";

describe("Fields", () => {
  describe("Search field", () => {
    it("undefined returns empty string ''", () => {
      const { success, data } = searchFieldExtend.safeParse(undefined);
      expect(success).toBe(true);
      expect(data).toBe("");
    });

    it("Wrong search returns default ''", () => {
      const { success, data } = searchFieldExtend.safeParse(123);
      expect(success).toBe(true);
      expect(data).toBe("");
    });
  });

  describe("Page field", () => {
    it("undefined returns default 1", () => {
      const { success, data } = pageField.safeParse(undefined);
      expect(success).toBe(true);
      expect(data).toBe(1);
    });

    it("Wrong page returns default 1", () => {
      const { success, data } = pageField.safeParse("what");
      expect(success).toBe(true);
      expect(data).toBe(1);
    });

    it("Page coerces string digit correctly", () => {
      const { success, data } = pageField.safeParse("2");
      expect(success).toBe(true);
      expect(data).toBe(2);
    });
  });
});
