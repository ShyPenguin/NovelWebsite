import { pageField } from "@/shared/validations/fields.js";
import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Fields", () => {
  describe("pageField", () => {
    it("0 returns error", () => {
      const data = 0;

      const { success, error } = pageField.safeParse(data);
      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Page is minimum 1");
    });

    it("'what' returns error", () => {
      const data = "what";
      const { success, error } = pageField.safeParse(data);
      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Page must be a number");
    });
    it("1 returns success", () => {
      const inputData = 1;
      const { success, data } = pageField.safeParse(inputData);
      expect(success).toBe(true);
      expect(data).toBe(inputData);
    });
  });
});
