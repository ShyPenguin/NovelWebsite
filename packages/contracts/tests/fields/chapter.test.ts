import {
  chapterStatusField,
  chapterAccessField,
  chapterNumberField,
} from "@/fields/chapter.fields.js";
import { expect, describe, it } from "vitest";
import { z } from "zod";

describe("Chapter fields", () => {
  describe("chapterStatusField", () => {
    it("returns fail when chapterStatusField is undefined", () => {
      const { success, error } = chapterStatusField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Status must be either draft, review or published",
      );
    });

    it("returns fail when chapterStatusField is not supported status (russian)", () => {
      const { success, error } = chapterStatusField.safeParse("russian");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Status must be either draft, review or published",
      );
    });

    it("success", () => {
      const { success } = chapterStatusField.safeParse("published");

      expect(success).toBe(true);
    });
  });

  describe("chapterAccessField", () => {
    it("returns fail when chapterAccessField is undefined", () => {
      const { success, error } = chapterAccessField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Access must be either free or paid",
      );
    });

    it("returns fail when chapterAccessField is not supported status (russian)", () => {
      const { success, error } = chapterAccessField.safeParse("russian");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Access must be either free or paid",
      );
    });

    it("success", () => {
      const { success } = chapterAccessField.safeParse("free");

      expect(success).toBe(true);
    });
  });

  describe("chapterNumberField", () => {
    it("returns fail when chapterNumberField is undefined", () => {
      const { success, error } = chapterNumberField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Chapter's number is required");
    });

    it("returns fail when chapterNumberField is not a number", () => {
      const { success, error } = chapterNumberField.safeParse("russian");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Chapter's number must be a number");
    });

    it("success even with string '5' ", () => {
      const { success } = chapterNumberField.safeParse("5");

      expect(success).toBe(true);
    });

    it("success with number 5", () => {
      const { success } = chapterNumberField.safeParse(5);

      expect(success).toBe(true);
    });
  });
});
