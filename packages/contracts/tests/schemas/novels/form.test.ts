import { expect, describe, it } from "vitest";
import { randomUUID } from "crypto";
import { z } from "zod";
import { NovelFormDTO } from "@/dto/novel.js";
import { NovelFormSchema } from "@/schemas/novel/schema.js";
import { getFormattedDate } from "@/utils/export/getFormattedDate/index.js";

const novel: NovelFormDTO = {
  title: "The Reincarnated Assassin is a Genius Swordsman",
  authorId: randomUUID(),
  description:
    "Raon’s entire life had been lived as a dog on a leash. Through a twist of fate, he obtained a new life. Wrath remained in the wreckage of his destroyed leash. Finally capable of standing on his own feet, he decided to live life by his own will. He would slay anyone standing in his way… Even if they were a god.",
  type: "original",
  language: "english",
  release: "2002-07-31",
  status: "COMPLETED",
  schedule: ["FRI", "MON", "SUN"],
  categories: [randomUUID(), randomUUID(), randomUUID()],
};

describe("NovelFormSchema", () => {
  describe("Check Schema's borrowed fields (borrowed fields must be tested in field file test)", () => {
    it("fails when title is missing", () => {
      const { title, ...novelWithoutTitle } = novel;

      const { success, error } = NovelFormSchema.safeParse(novelWithoutTitle);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.title?.[0]).toBe("Title is required");
    });

    it("fails when description is missing", () => {
      const { description, ...novelWithoutDescription } = novel;

      const { success, error } = NovelFormSchema.safeParse(
        novelWithoutDescription,
      );

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.description?.[0]).toBe(
        "Description is required",
      );
    });

    it("fails when type is not supported", () => {
      const data = {
        ...novel,
        type: "chicken",
      };

      const { success, error } = NovelFormSchema.safeParse(data);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.type?.[0]).toBe(
        "Type must be either original or translated",
      );
    });

    it("fails when language is not supported", () => {
      const data = {
        ...novel,
        language: "chicken",
      };

      const { success, error } = NovelFormSchema.safeParse(data);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.language?.[0]).toBe(
        "Language must be either english, korean, chinese or japanese",
      );
    });

    it("fails when status is not supported", () => {
      const data = {
        ...novel,
        status: "chicken",
      };

      const { success, error } = NovelFormSchema.safeParse(data);

      expect(success).toBe(false);

      const flattened = z.flattenError(error!);
      const fieldErrors = flattened.fieldErrors;

      // Get the first field with an error
      const firstErrorField = Object.keys(
        fieldErrors,
      )[0] as keyof typeof fieldErrors;

      expect(fieldErrors[firstErrorField]?.[0]).toBe(
        "Status must be either ONGOING, COMPLETED, HIATUS or DROPPED",
      );
    });

    it("fails when schedule supports a day that does not exist", () => {
      const novelWithWrongSchedule = {
        ...novel,
        schedule: ["MONDAY"],
      };
      const { success, error } = NovelFormSchema.safeParse(
        novelWithWrongSchedule,
      );
      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.schedule?.[0]).toBe(
        "day must be: SUN, MON, TUE, WED, THU, FRI, or SAT",
      );
    });
  });

  describe("Testing Schema's original fields", () => {
    it("fails when authorId is missing", () => {
      const { authorId, ...novelWithoutAuthorId } = novel;

      const { success, error } =
        NovelFormSchema.safeParse(novelWithoutAuthorId);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.authorId?.[0]).toBe("Author is required");
    });

    it("fails when authorId is not in correct format", () => {
      const novelWithIncorrectAuthorId = {
        ...novel,
        authorId: "3123123",
      };

      const { success, error } = NovelFormSchema.safeParse(
        novelWithIncorrectAuthorId,
      );

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.authorId?.[0]).toBe(
        "Author's value must be in UUID form",
      );
    });

    it("fails when categories contains not in correct format", () => {
      const novelWithIncorrectCategories = {
        ...novel,
        categories: [randomUUID(), "3123123", randomUUID()],
      };

      const { success, error } = NovelFormSchema.safeParse(
        novelWithIncorrectCategories,
      );

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.categories?.[0]).toBe(
        "Category's value must be in UUID form",
      );
    });

    it("fails when release is not in correct format", () => {
      const novelWithWrongRelease = {
        ...novel,
        release: "07-31-2002",
      };
      const { success, error } = NovelFormSchema.safeParse(
        novelWithWrongRelease,
      );
      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.release?.[0]).toBe(
        "Release must be in YYYY-MM-DD string format",
      );
    });
  });

  describe("Testing Schema's optional and default", () => {
    it("succeed without type, default to translated", () => {
      const { type, ...novelWithoutType } = novel;

      const { success, data } = NovelFormSchema.safeParse(novelWithoutType);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...novel,
        type: "translated",
      });
    });

    it("succeed without release, default to today", () => {
      const { release, ...novelWithoutRelease } = novel;

      const { success, data } = NovelFormSchema.safeParse(novelWithoutRelease);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...novel,
        release: getFormattedDate(new Date()),
      });
    });

    it("succeed without language, default to korean", () => {
      const { language, ...novelWithoutLanguage } = novel;

      const { success, data } = NovelFormSchema.safeParse(novelWithoutLanguage);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...novel,
        language: "korean",
      });
    });

    it("succeed without status, default to ONGOING", () => {
      const { status, ...novelWithoutStatus } = novel;

      const { success, data } = NovelFormSchema.safeParse(novelWithoutStatus);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...novel,
        status: "ONGOING",
      });
    });

    it("succeed without schedule, default to empty array", () => {
      const { schedule, ...novelWithoutSchedule } = novel;

      const { success, data } = NovelFormSchema.safeParse(novelWithoutSchedule);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...novel,
        schedule: [],
      });
    });

    it("succeed without categories, default to empty array", () => {
      const { categories, ...novelWithoutCategories } = novel;

      const { success, data } = NovelFormSchema.safeParse(
        novelWithoutCategories,
      );
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...novel,
        categories: [],
      });
    });
  });
});
