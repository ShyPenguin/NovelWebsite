import {
  NovelQueryInput,
  NovelQuerySchema,
} from "@/features/novels/novel.schema.ts";
import { describe, it, expect } from "vitest";
import z from "zod";

const query = {
  search: "test",
  page: 2,
  pageSize: 30,
  sort: "desc(title)",
  status: "ALL",
} satisfies NovelQueryInput;

describe("Chapter Query Validation", () => {
  describe("Fields that are FULLY override", () => {
    describe("Page Field", () => {
      it("missing page returns success without page field", () => {
        const { page, ...queryWithoutPage } = query;
        const { success, data } = NovelQuerySchema.safeParse(queryWithoutPage);
        expect(success).toBe(true);
        expect(data).toMatchObject(queryWithoutPage);
      });

      it("page 0 returns error", () => {
        const queryWithWrongPage = {
          ...query,
          page: 0,
        };
        const { success, error } =
          NovelQuerySchema.safeParse(queryWithWrongPage);
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.page?.[0]).toBe("Page is minimum 1");
      });

      it("page 'what' returns error", () => {
        const queryWithWrongPage = {
          ...query,
          page: "what",
        };
        const { success, error } =
          NovelQuerySchema.safeParse(queryWithWrongPage);
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.page?.[0]).toBe("Page must be a number");
      });

      it("page '1' returns success", () => {
        const queryWithString1 = {
          ...query,
          page: "1",
        };
        const { success, data } = NovelQuerySchema.safeParse(queryWithString1);
        expect(success).toBe(true);
        expect(data).toMatchObject({
          ...query,
          page: 1,
        });
      });
    });
    describe("PageSize Field", () => {
      it("missing pageSize returns success without pageSize field", () => {
        const { pageSize, ...queryWithoutPageSize } = query;
        const { success, data } =
          NovelQuerySchema.safeParse(queryWithoutPageSize);
        expect(success).toBe(true);
        expect(data).toMatchObject(queryWithoutPageSize);
      });

      it("pageSize 0 returns error", () => {
        const queryWithWrongPageSize = {
          ...query,
          pageSize: 0,
        };
        const { success, error } = NovelQuerySchema.safeParse(
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
        const { success, error } = NovelQuerySchema.safeParse(
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
        const { success, error } = NovelQuerySchema.safeParse(
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
        const { success, data } = NovelQuerySchema.safeParse(queryWithString1);
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
          NovelQuerySchema.safeParse(queryWithWrongSearch);
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.search?.[0]).toBe(
          "Search must be a string",
        );
      });

      it("missing search returns success", () => {
        const { search, ...queryWithoutSearch } = query;
        const { success, data } =
          NovelQuerySchema.safeParse(queryWithoutSearch);
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
          NovelQuerySchema.safeParse(queryWithWrongSort);
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.sort?.[0]).toBe(
          "Sort must be asc(createdAt), desc(createdAt), asc(updatedAt), desc(updatedAt), asc(title) or desc(title)",
        );
      });

      it("Without sort returns default 'desc(title)'", () => {
        const { sort, ...queryWithoutSort } = query;
        const { success, data } = NovelQuerySchema.safeParse(queryWithoutSort);
        expect(success).toBe(true);
        expect(data).toMatchObject({
          ...query,
          sort: "desc(title)",
        });
      });
    });
    describe("Status", () => {
      it("Parent's field's error", () => {
        const queryWithWrongStatus = {
          ...query,
          status: "what",
        };
        const { success, error } =
          NovelQuerySchema.safeParse(queryWithWrongStatus);
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.status?.[0]).toBe(
          "Status must be either ALL, ONGOING, DROPPED, HIATUS, or COMPLETED",
        );
      });

      it("Without status returns default 'ALL'", () => {
        const { status, ...queryWithoutStatus } = query;
        const { success, data } =
          NovelQuerySchema.safeParse(queryWithoutStatus);
        expect(success).toBe(true);
        expect(data).toMatchObject({ ...query, status: "ALL" });
      });
    });
  });
});
