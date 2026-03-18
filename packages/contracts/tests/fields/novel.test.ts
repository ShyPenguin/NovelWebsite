import {
  novelSortField,
  novelSortWithDirectionField,
} from "@/factories/novel/index.js";
import {
  novelTypeField,
  languageField,
  novelStatusField,
  weekDayField,
  novelStatusQueryField,
  createStringNumberToNumber,
  bookmarksField,
} from "@/fields/novel.fields.js";
import { expect, describe, it } from "vitest";
import { z } from "zod";

describe("Novel fields", () => {
  describe("novelTypeField", () => {
    it("returns fail when novelTypes is undefined", () => {
      const { success, error } = novelTypeField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Type must be either original or translated",
      );
    });

    it("returns fail when novelTypes is not supported type (chicken)", () => {
      const { success, error } = novelTypeField.safeParse("chicken");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Type must be either original or translated",
      );
    });

    it("success", () => {
      const { success } = novelTypeField.safeParse("original");

      expect(success).toBe(true);
    });
  });

  describe("languageField", () => {
    it("returns fail when languageField is undefined", () => {
      const { success, error } = languageField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Language must be either english, korean, chinese or japanese",
      );
    });

    it("returns fail when languageField is not supported language (russian)", () => {
      const { success, error } = languageField.safeParse("russian");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Language must be either english, korean, chinese or japanese",
      );
    });

    it("success", () => {
      const { success } = languageField.safeParse("english");

      expect(success).toBe(true);
    });
  });

  describe("novelStatusField", () => {
    it("returns fail when novelStatusField is undefined", () => {
      const { success, error } = novelStatusField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Status must be either ONGOING, COMPLETED, HIATUS or DROPPED",
      );
    });

    it("returns fail when novelStatusField is not supported status (russian)", () => {
      const { success, error } = novelStatusField.safeParse("russian");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Status must be either ONGOING, COMPLETED, HIATUS or DROPPED",
      );
    });

    it("success", () => {
      const { success } = novelStatusField.safeParse("ONGOING");

      expect(success).toBe(true);
    });
  });

  describe("novelSortField", () => {
    it("returns fail when novelSortField is undefined", () => {
      const { success, error } = novelSortField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Sort must be createdAt, updatedAt or title",
      );
    });

    it("returns fail when novelSortField is not supported status (desc)", () => {
      const { success, error } = novelSortField.safeParse("desc");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Sort must be createdAt, updatedAt or title",
      );
    });

    it("success", () => {
      const { success } = novelSortField.safeParse("title");

      expect(success).toBe(true);
    });
  });

  describe("novelSortWithDirectionField", () => {
    it("returns fail when novelSortWithDirectionField is undefined", () => {
      const { success, error } =
        novelSortWithDirectionField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Sort must be either asc(createdAt), desc(createdAt), asc(updatedAt), desc(updatedAt), asc(title) or desc(title)",
      );
    });

    it("returns fail when novelSortWithDirectionField is not supported status (russian)", () => {
      const { success, error } =
        novelSortWithDirectionField.safeParse("russian");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Sort must be either asc(createdAt), desc(createdAt), asc(updatedAt), desc(updatedAt), asc(title) or desc(title)",
      );
    });

    it("success", () => {
      const { success } =
        novelSortWithDirectionField.safeParse("desc(updatedAt)");

      expect(success).toBe(true);
    });
  });

  describe("weekDayField", () => {
    it("returns fail when weekDayField is undefined", () => {
      const { success, error } = weekDayField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "day must be: SUN, MON, TUE, WED, THU, FRI, or SAT",
      );
    });

    it("returns fail when weekDayField is not supported day (russian)", () => {
      const { success, error } = weekDayField.safeParse("russian");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "day must be: SUN, MON, TUE, WED, THU, FRI, or SAT",
      );
    });

    it("success", () => {
      const { success } = weekDayField.safeParse("SUN");

      expect(success).toBe(true);
    });
  });

  describe("novelStatusQueryField", () => {
    it("returns fail when novelStatusQueryField is undefined", () => {
      const { success, error } = novelStatusQueryField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Status must be either ALL, ONGOING, COMPLETED, HIATUS or DROPPED",
      );
    });

    it("returns fail when novelStatusQueryField is not supported status (russian)", () => {
      const { success, error } = novelStatusQueryField.safeParse("russian");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Status must be either ALL, ONGOING, COMPLETED, HIATUS or DROPPED",
      );
    });

    it("success with ALL", () => {
      const { success } = novelStatusQueryField.safeParse("ALL");

      expect(success).toBe(true);
    });
  });

  describe("createStringNumberToNumber('Total chapters')", () => {
    it("returns fail when createStringNumberToNumber('Total chapters') is undefined", () => {
      const { success, error } =
        createStringNumberToNumber("Total chapters").safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Total chapters is required");
    });

    it("returns fail when createStringNumberToNumber('Total chapters') is not a number", () => {
      const { success, error } =
        createStringNumberToNumber("Total chapters").safeParse("russian");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Total chapters must be a number");
    });

    it("success even with string '5' ", () => {
      const { success } =
        createStringNumberToNumber("Total chapters").safeParse("5");

      expect(success).toBe(true);
    });

    it("success with number 5", () => {
      const { success } =
        createStringNumberToNumber("Total chapters").safeParse(5);

      expect(success).toBe(true);
    });
    it("success with number 5 ENCODE", () => {
      const { success } =
        createStringNumberToNumber("Total chapters").safeEncode(5);

      expect(success).toBe(true);
    });
  });

  describe("bookmarksField", () => {
    it("returns fail when bookmarksField is undefined", () => {
      const { success, error } = bookmarksField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Bookmarks is required");
    });

    it("returns fail when bookmarksField is not a number", () => {
      const { success, error } = bookmarksField.safeParse("russian");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Bookmarks must be a number");
    });

    it("success even with string '5' ", () => {
      const { success } = bookmarksField.safeParse("5");

      expect(success).toBe(true);
    });

    it("success with number 5", () => {
      const { success } = bookmarksField.safeParse(5);

      expect(success).toBe(true);
    });
  });
});
