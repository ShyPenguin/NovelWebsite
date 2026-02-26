import {
  AuthorQueryInput,
  AuthorQuerySchema,
} from "@/features/authors/author.schema.ts";
import { describe, it, expect } from "vitest";
import z from "zod";

const query = {
  search: "wew",
  page: 2,
  pageSize: 30,
} satisfies AuthorQueryInput;

// Every field is fully override
describe("Author Query Validation", () => {
  describe("Page Field (borrowed field from index must be tested on its own but extended with optional)", () => {
    it("missing page returns success without page field", () => {
      const { page, ...queryWithoutPage } = query;
      const { success, data } = AuthorQuerySchema.safeParse(queryWithoutPage);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutPage);
    });

    it("page 0 returns error", () => {
      const queryWithWrongPage = {
        ...query,
        page: 0,
      };
      const { success, error } =
        AuthorQuerySchema.safeParse(queryWithWrongPage);
      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.fieldErrors.page?.[0]).toBe("Page is minimum 1");
    });
  });

  describe("PageSize Field", () => {
    it("missing pageSize returns success without pageSize field", () => {
      const { pageSize, ...queryWithoutPageSize } = query;
      const { success, data } =
        AuthorQuerySchema.safeParse(queryWithoutPageSize);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutPageSize);
    });

    it("pageSize 0 returns error", () => {
      const queryWithWrongPageSize = {
        ...query,
        pageSize: 0,
      };
      const { success, error } = AuthorQuerySchema.safeParse(
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
      const { success, error } = AuthorQuerySchema.safeParse(
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
      const { success, error } = AuthorQuerySchema.safeParse(
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
      const { success, data } = AuthorQuerySchema.safeParse(queryWithString1);
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
        AuthorQuerySchema.safeParse(queryWithWrongSearch);
      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.fieldErrors.search?.[0]).toBe("Search must be a string");
    });

    it("missing search returns success", () => {
      const { search, ...queryWithoutSearch } = query;
      const { success, data } = AuthorQuerySchema.safeParse(queryWithoutSearch);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutSearch);
    });
  });
});
