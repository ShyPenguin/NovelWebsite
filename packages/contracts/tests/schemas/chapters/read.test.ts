import { expect, describe, it } from "vitest";
import { z } from "zod";
import {
  ChapterDetailDTO,
  ChapterDetailEncodeDTO,
} from "../../../src/dto/chapter";
import { randomUUID } from "crypto";
import { ChapterDetailSchema } from "../../../src/schemas/chapter/schema";
import { getFormattedDate } from "../../../src/utils/export/getFormattedDate";

const date = new Date(getFormattedDate(new Date()));
const translatorId = randomUUID();
const chapterId = randomUUID();
const novelId = randomUUID();
const prevChapterId = randomUUID();
const nextChapterId = randomUUID();

const chapterEncode: ChapterDetailEncodeDTO = {
  id: chapterId,
  novelId: novelId,
  translator: {
    id: translatorId,
    name: "Jawad",
  },
  chapterNumber: 20,
  title: "Test",
  sourceDocUrl:
    "https://docs.google.com/document/d/1hPxEP32WViJX0e5dQtmSKRS02996ghkQugCXG4s8u1s/edit?tab=t.0",
  publishedAt: getFormattedDate(date),
  createdAt: date.toISOString(),
  updatedAt: date.toISOString(),
  contentHtml: "lmaoooo he sucks",
  access: "free",
  status: "published",
  prevChapter: prevChapterId,
  nextChapter: nextChapterId,
};

const chapterDecode: ChapterDetailDTO = {
  ...(chapterEncode as Omit<
    ChapterDetailEncodeDTO,
    "publishedAt" | "createdAt" | "updatedAt"
  >),
  publishedAt: date,
  createdAt: date,
  updatedAt: date,
};

describe("Chapter Detail", () => {
  describe("Borrowed fields (must be tested in field file test or other schema's)", () => {
    it("fails when id is missing", () => {
      const { id, ...chapterWithoutId } = chapterEncode;

      const { success, error } =
        ChapterDetailSchema.safeParse(chapterWithoutId);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.id?.[0]).toBe("ID is required");
    });

    it("fails when novelId is missing", () => {
      const { novelId, ...chapterWithoutNovelId } = chapterEncode;

      const { success, error } = ChapterDetailSchema.safeParse(
        chapterWithoutNovelId,
      );

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.novelId?.[0]).toBe("Novel's ID is required");
    });

    it("fails when chapterNumber is missing", () => {
      const { chapterNumber, ...chapterWithoutChapterNumber } = chapterEncode;

      const { success, error } = ChapterDetailSchema.safeParse(
        chapterWithoutChapterNumber,
      );

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.chapterNumber?.[0]).toBe(
        "Chapter's number is required",
      );
    });

    it("fails when title is missing", () => {
      const { title, ...chapterWithoutTitle } = chapterEncode;

      const { success, error } =
        ChapterDetailSchema.safeParse(chapterWithoutTitle);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.title?.[0]).toBe("Title is required");
    });

    it("fails when sourceDocUrl is missing", () => {
      const { sourceDocUrl, ...chapterWithoutsourceDocUrl } = chapterEncode;

      const { success, error } = ChapterDetailSchema.safeParse(
        chapterWithoutsourceDocUrl,
      );

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.sourceDocUrl?.[0]).toBe(
        "Source document url is required",
      );
    });

    it("fails when access is missing", () => {
      const { access, ...chapterWithoutAccess } = chapterEncode;

      const { success, error } =
        ChapterDetailSchema.safeParse(chapterWithoutAccess);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.access?.[0]).toBe(
        "Access must be either free or paid",
      );
    });
    it("fails when status is missing", () => {
      const { status, ...chapterWithoutStatus } = chapterEncode;

      const { success, error } =
        ChapterDetailSchema.safeParse(chapterWithoutStatus);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.status?.[0]).toBe(
        "Status must be either draft, review or published",
      );
    });

    it("fails when createdAt is missing", () => {
      const { createdAt, ...chapterWithoutCreatedAt } = chapterEncode;

      const { success, error } = ChapterDetailSchema.safeParse(
        chapterWithoutCreatedAt,
      );

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.createdAt?.[0]).toBe(
        "createdAt is required",
      );
    });
    it("fails when updatedAt is missing", () => {
      const { updatedAt, ...chapterWithoutUpdatedAt } = chapterEncode;

      const { success, error } = ChapterDetailSchema.safeParse(
        chapterWithoutUpdatedAt,
      );

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);

      expect(flattened.fieldErrors.updatedAt?.[0]).toBe(
        "updatedAt is required",
      );
    });
  });

  describe("Borrowed fields but extended", () => {
    describe("publishedAt", () => {
      it("works even if publishedAt is missing", () => {
        const { publishedAt, ...chapterWithoutPublishedAt } = chapterEncode;

        const { success, data } = ChapterDetailSchema.safeParse(
          chapterWithoutPublishedAt,
        );

        expect(success).toBe(true);
        expect(data).toMatchObject({
          ...chapterWithoutPublishedAt,
          createdAt: new Date(chapterWithoutPublishedAt.createdAt),
          updatedAt: new Date(chapterWithoutPublishedAt.updatedAt),
        });
      });
      it("returns fail with wrong publishedAt", () => {
        const chapterWithWrongPublishedAt = {
          ...chapterEncode,
          publishedAt: new Date(),
        };

        const { success, error } = ChapterDetailSchema.safeParse(
          chapterWithWrongPublishedAt,
        );

        expect(success).toBe(false);
        const flattened = z.flattenError(error!);

        expect(flattened.fieldErrors.publishedAt?.[0]).toBe(
          "Published at must be in YYYY-MM-DD string format",
        );
      });
    });

    describe("translator", () => {
      it("works even if translator is missing", () => {
        const { translator, ...chapterWithoutTranslator } = chapterEncode;

        const { success, data } = ChapterDetailSchema.safeParse(
          chapterWithoutTranslator,
        );

        expect(success).toBe(true);
        expect(data).toMatchObject({
          ...chapterWithoutTranslator,
          publishedAt: new Date(chapterWithoutTranslator.publishedAt!),
          createdAt: new Date(chapterWithoutTranslator.createdAt),
          updatedAt: new Date(chapterWithoutTranslator.updatedAt),
        });
      });

      it("returns fail with wrong translator", () => {
        const chapterWithWrongTranslator = {
          ...chapterEncode,
          translator: new Date(),
        };

        const { success, error } = ChapterDetailSchema.safeParse(
          chapterWithWrongTranslator,
        );

        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.translator?.[0] !== undefined).toBe(true);
      });
    });
  });
  describe("Schema's original fields", () => {
    describe("contentHtml", () => {
      it("fails when contentHtml is missing", () => {
        const { contentHtml, ...chapterWithoutContentHtml } = chapterEncode;

        const { success, error } = ChapterDetailSchema.safeParse(
          chapterWithoutContentHtml,
        );

        expect(success).toBe(false);
        const flattened = z.flattenError(error!);

        expect(flattened.fieldErrors.contentHtml?.[0]).toBe(
          "Content is required",
        );
      });

      it("fails when contentHtml is not string", () => {
        const chapterWithWrongContentHtml = {
          ...chapterEncode,
          contentHtml: 123,
        };

        const { success, error } = ChapterDetailSchema.safeParse(
          chapterWithWrongContentHtml,
        );

        expect(success).toBe(false);
        const flattened = z.flattenError(error!);

        expect(flattened.fieldErrors.contentHtml?.[0]).toBe(
          "Content must be a string",
        );
      });
    });

    describe("prevChapter (basically the same as nextChapter)", () => {
      it("fails when prevChapter is in wrong format", () => {
        const chapterWithWrongPrevChapter = {
          ...chapterEncode,
          prevChapter: 123,
        };

        const { success, error } = ChapterDetailSchema.safeParse(
          chapterWithWrongPrevChapter,
        );

        expect(success).toBe(false);
        const flattened = z.flattenError(error!);

        expect(flattened.fieldErrors.prevChapter?.[0]).toBe(
          "prevChapter's ID is not in correct format",
        );
      });

      it("success even if prevChapter and nextChapter are undefined", () => {
        const { prevChapter, nextChapter, ...chapterWithoutPrevNext } =
          chapterEncode;

        const { success, data } = ChapterDetailSchema.safeParse(
          chapterWithoutPrevNext,
        );

        expect(success).toBe(true);

        const {
          prevChapter: blank,
          nextChapter: _,
          ...chapterDecodeWithoutPrevNext
        } = chapterDecode;

        expect(data).toMatchObject(chapterDecodeWithoutPrevNext);
      });
    });
  });
});
