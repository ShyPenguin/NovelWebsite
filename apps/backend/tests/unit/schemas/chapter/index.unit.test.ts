import {
  ChapterQueryInput,
  ChapterQuerySchema,
} from "@/features/chapters/chapter.schema.ts";
import { describe, it, expect } from "vitest";

import z from "zod";

const query = {
  search: "test",
  page: 2,
  pageSize: 30,
  sort: "asc(chapterNumber)",
  access: "paid",
} satisfies ChapterQueryInput;

describe("Chapter Query Validation", () => {
  describe("Fields that are FULLY override", () => {
    describe("Page Field (borrowed field from index must be tested on its own but extended with optional)", () => {
      it("missing page returns success without page field", () => {
        const { page, ...queryWithoutPage } = query;
        const { success, data } =
          ChapterQuerySchema.safeParse(queryWithoutPage);
        expect(success).toBe(true);
        expect(data).toMatchObject(queryWithoutPage);
      });

      it("page 0 returns error", () => {
        const queryWithWrongPage = {
          ...query,
          page: 0,
        };
        const { success, error } =
          ChapterQuerySchema.safeParse(queryWithWrongPage);
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.page?.[0]).toBe("Page is minimum 1");
      });
    });
    describe("PageSize Field", () => {
      it("missing pageSize returns success without pageSize field", () => {
        const { pageSize, ...queryWithoutPageSize } = query;
        const { success, data } =
          ChapterQuerySchema.safeParse(queryWithoutPageSize);
        expect(success).toBe(true);
        expect(data).toMatchObject(queryWithoutPageSize);
      });

      it("pageSize 0 returns error", () => {
        const queryWithWrongPageSize = {
          ...query,
          pageSize: 0,
        };
        const { success, error } = ChapterQuerySchema.safeParse(
          queryWithWrongPageSize,
        );
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.pageSize?.[0]).toBe(
          "Page's size is minimum 1",
        );
      });

      it("pageSize 101 returns error", () => {
        const queryWithWrongPageSize = {
          ...query,
          pageSize: 101,
        };
        const { success, error } = ChapterQuerySchema.safeParse(
          queryWithWrongPageSize,
        );
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.pageSize?.[0]).toBe(
          "Page's size is maximum 100",
        );
      });

      it("pageSize 'what' returns error", () => {
        const queryWithWrongPageSize = {
          ...query,
          pageSize: "what",
        };
        const { success, error } = ChapterQuerySchema.safeParse(
          queryWithWrongPageSize,
        );
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.pageSize?.[0]).toBe(
          "Page's size must be a number",
        );
      });

      it("pageSize '1' returns success", () => {
        const queryWithString1 = {
          ...query,
          pageSize: "1",
        };
        const { success, data } =
          ChapterQuerySchema.safeParse(queryWithString1);
        expect(success).toBe(true);
        expect(data).toMatchObject({
          ...query,
          pageSize: 1,
        });
      });
    });
    describe("search", () => {
      it("search Number Type and Value 1 returns error", () => {
        const queryWithWrongSearch = {
          ...query,
          search: 1,
        };
        const { success, error } =
          ChapterQuerySchema.safeParse(queryWithWrongSearch);
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.search?.[0]).toBe(
          "Search must be a string",
        );
      });

      it("missing search returns success", () => {
        const { search, ...queryWithoutSearch } = query;
        const { success, data } =
          ChapterQuerySchema.safeParse(queryWithoutSearch);
        expect(success).toBe(true);
        expect(data).toMatchObject(queryWithoutSearch);
      });
    });
  });

  describe("Shared Fields But Extended Those Fields \
     (those inherited behavior of those fields on schema's parent)", () => {
    describe("Sort Field", () => {
      it("Parent's field's error", () => {
        const queryWithWrongSort = {
          ...query,
          sort: "what",
        };
        const { success, error } =
          ChapterQuerySchema.safeParse(queryWithWrongSort);
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.sort?.[0]).toBe(
          "Sort must be either asc(chapterNumber) or desc(chapterNumber)",
        );
      });

      it("Without sort returns default 'asc(chapterNumber)'", () => {
        const { sort, ...queryWithoutSort } = query;
        const { success, data } =
          ChapterQuerySchema.safeParse(queryWithoutSort);
        expect(success).toBe(true);
        expect(data).toMatchObject({
          ...query,
          sort: "asc(chapterNumber)",
        });
      });
    });
  });
  describe("Inherited field (only Access)", () => {
    it("Parent's field's error", () => {
      const queryWithWrongAccess = {
        ...query,
        access: "what",
      };
      const { success, error } =
        ChapterQuerySchema.safeParse(queryWithWrongAccess);
      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.fieldErrors.access?.[0]).toBe(
        "Access must be either free or paid",
      );
    });

    it("Without access returns default 'desc'", () => {
      const { access, ...queryWithoutAccess } = query;
      const { success, data } =
        ChapterQuerySchema.safeParse(queryWithoutAccess);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutAccess);
    });
  });
});
