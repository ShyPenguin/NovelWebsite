import {
  UserQueryInput,
  UserQuerySchema,
} from "@/features/users/user.schema.ts";
import { describe, it, expect } from "vitest";
import z from "zod";

const query = {
  sort: "asc(name)",
  role: "admin",
  search: "wew",
  page: 2,
  pageSize: 100,
} satisfies UserQueryInput;

// Every field is fully override
describe("User Query Validation", () => {
  describe("Page Field (borrowed field from index must be tested on its own but extended with optional)", () => {
    it("missing page returns success without page field", () => {
      const { page, ...queryWithoutPage } = query;
      const { success, data } = UserQuerySchema.safeParse(queryWithoutPage);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutPage);
    });

    it("page 0 returns error", () => {
      const queryWithWrongPage = {
        ...query,
        page: 0,
      };
      const { success, error } = UserQuerySchema.safeParse(queryWithWrongPage);
      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.fieldErrors.page?.[0]).toBe("Page is minimum 1");
    });
  });

  describe("PageSize Field", () => {
    it("missing pageSize returns success without pageSize field", () => {
      const { pageSize, ...queryWithoutPageSize } = query;
      const { success, data } = UserQuerySchema.safeParse(queryWithoutPageSize);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutPageSize);
    });

    it("pageSize 0 returns error", () => {
      const queryWithWrongPageSize = {
        ...query,
        pageSize: 0,
      };
      const { success, error } = UserQuerySchema.safeParse(
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
      const { success, error } = UserQuerySchema.safeParse(
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
      const { success, error } = UserQuerySchema.safeParse(
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
      const { success, data } = UserQuerySchema.safeParse(queryWithString1);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        pageSize: 1,
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
          UserQuerySchema.safeParse(queryWithWrongSort);
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.sort?.[0]).toBe(
          "Sort must be either asc(createdAt), desc(createdAt), asc(updatedAt), desc(updatedAt), asc(name), desc(name), asc(username) or desc(username)",
        );
      });

      it("Without sort returns default 'desc(name)'", () => {
        const { sort, ...queryWithoutSort } = query;
        const { success, data } = UserQuerySchema.safeParse(queryWithoutSort);
        expect(success).toBe(true);
        expect(data).toMatchObject({
          ...query,
          sort: "desc(name)",
        });
      });
    });
    describe("Role", () => {
      it("Parent's field's error", () => {
        const queryWithWrongRole = {
          ...query,
          role: "what",
        };
        const { success, error } =
          UserQuerySchema.safeParse(queryWithWrongRole);
        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.fieldErrors.role?.[0]).toBe(
          "Role must be either all, user, staff, supervisor or admin",
        );
      });

      it("Without role returns default 'all'", () => {
        const { role, ...queryWithoutRole } = query;
        const { success, data } = UserQuerySchema.safeParse(queryWithoutRole);
        expect(success).toBe(true);
        expect(data).toMatchObject({ ...query, role: "all" });
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
        UserQuerySchema.safeParse(queryWithWrongSearch);
      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.fieldErrors.search?.[0]).toBe("Search must be a string");
    });

    it("missing search returns success", () => {
      const { search, ...queryWithoutSearch } = query;
      const { success, data } = UserQuerySchema.safeParse(queryWithoutSearch);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutSearch);
    });
  });
});
