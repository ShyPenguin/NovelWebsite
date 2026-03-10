import {
  UserSearchPaginatedSchema,
  UserSearchSchema,
  type UserSearchPaginated,
} from "@/features/users/user.schema";
import { expect, describe, it } from "vitest";

const query = {
  page: 2,
  search: "31",
  sort: "desc(createdAt)",
  role: "user",
} satisfies UserSearchPaginated;

describe("UserQuery Shared Fields", () => {
  describe("Sort field", () => {
    it("Without sort returns default desc(createdAt)", () => {
      const { sort, ...queryWithoutSort } = query;
      const { success, data } =
        UserSearchPaginatedSchema.safeParse(queryWithoutSort);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        sort: "desc(createdAt)",
      });
    });

    it("Wrong sort returns default desc(createdAt)", () => {
      const queryWithWrongSort = {
        ...query,
        sort: "desc",
      };
      const { success, data } =
        UserSearchPaginatedSchema.safeParse(queryWithWrongSort);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        sort: "desc(createdAt)",
      });
    });
  });
  describe("Role field", () => {
    it("Without role returns default all", () => {
      const { role, ...queryWithoutRole } = query;
      const { success, data } =
        UserSearchPaginatedSchema.safeParse(queryWithoutRole);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        role: "all",
      });
    });

    it("Wrong role returns default all", () => {
      const queryWithWrongRole = {
        ...query,
        role: "desc",
      };
      const { success, data } =
        UserSearchPaginatedSchema.safeParse(queryWithWrongRole);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        role: "all",
      });
    });
  });

  describe("Fields borrowed from existing fields", () => {
    it("Without search returns default ''", () => {
      const { search, ...queryWithoutSearch } = query;
      const { success, data } =
        UserSearchPaginatedSchema.safeParse(queryWithoutSearch);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        search: "",
      });
    });

    it("Without page returns default 1", () => {
      const { page, ...queryWithoutPage } = query;
      const { success, data } =
        UserSearchPaginatedSchema.safeParse(queryWithoutPage);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        page: 1,
      });
    });
  });

  it("UserSearchSchema not paginated should ignore page", () => {
    const { page, ...queryWithoutPage } = query;
    const { success, data } = UserSearchSchema.safeParse(queryWithoutPage);
    expect(success).toBe(true);
    expect(data).toMatchObject(queryWithoutPage);
  });

  it("Successfully parsed", () => {
    const { success, data } = UserSearchPaginatedSchema.safeParse(query);

    expect(success).toBe(true);
    expect(data).toMatchObject(query);
  });

  it("Successfully parsed and ignored pageSize", () => {
    const { success, data } = UserSearchPaginatedSchema.safeParse({
      ...query,
      pageSize: 30,
    });

    expect(success).toBe(true);
    expect(data).toMatchObject(query);
  });
});
