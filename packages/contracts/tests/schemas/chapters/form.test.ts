import { expect, describe, it } from "vitest";
import { ChapterFormDTO } from "../../../src/dto/chapter";
import { ChapterFormSchema } from "../../../src/schemas/chapter/schema";
import { z } from "zod";
import { getFormattedDate } from "../../../src/utils/export/getFormattedDate";

const date = new Date(getFormattedDate(new Date()));
const form = {
  sourceDocUrl:
    "https://docs.google.com/document/d/1hPxEP32WViJX0e5dQtmSKRS02996ghkQugCXG4s8u1s/edit?tab=t.0",
  chapterNumber: 1,
  status: "published",
  access: "paid",
  publishedAt: getFormattedDate(date),
} satisfies ChapterFormDTO;

describe("Chapter Form \
    (All of these are fields are from ChapterForm)", () => {
  describe("Checking the inherited fields \
    (they are tested on the parent's schema)", () => {
    it("fails when sourceDocUrl is missing", () => {
      const { sourceDocUrl, ...formWithoutSDC } = form;
      const { success, error } = ChapterFormSchema.safeParse(formWithoutSDC);
      expect(success).toBe(false);

      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.sourceDocUrl?.[0]).toBe(
        "Source document url is required",
      );
    });

    it("fails when chapterNumber is missing", () => {
      const { chapterNumber, ...formWithoutSDC } = form;
      const { success, error } = ChapterFormSchema.safeParse(formWithoutSDC);
      expect(success).toBe(false);

      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.chapterNumber?.[0]).toBe(
        "Chapter's number is required",
      );
    });

    it("fails when publishedAt is in wrong format", () => {
      const formWithWrongPublishedAt = {
        ...form,
        publishedAt: new Date(),
      };
      const { success, error } = ChapterFormSchema.safeParse(
        formWithWrongPublishedAt,
      );
      expect(success).toBe(false);

      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.publishedAt?.[0]).toBe(
        "Published at must be in YYYY-MM-DD string format",
      );
    });
  });

  describe("Checking inherited fields but extended", () => {
    it("missing status and access returns default draft and free", () => {
      const { status, access, ...formWithoutAccessAndStatus } = form;

      const { success, data } = ChapterFormSchema.safeParse(
        formWithoutAccessAndStatus,
      );
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...form,
        publishedAt: date,
        status: "draft",
        access: "free",
      });
    });
  });
});
