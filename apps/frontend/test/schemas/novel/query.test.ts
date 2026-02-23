import { expect, describe, it } from "vitest";
import {
  NovelSearchPaginated,
  NovelSearchPaginatedSchema,
  NovelSearchSchema,
} from "../../../src/schemas/novels/index";

const query = {
  page: 2,
  search: "31",
  sort: "desc(createdAt)",
  status: "COMPLETED",
} satisfies NovelSearchPaginated;

describe("NovelQuery Shared Fields", () => {
  describe("Sort field", () => {
    it("Without sort returns default desc(createdAt)", () => {
      const { sort, ...queryWithoutSort } = query;
      const { success, data } =
        NovelSearchPaginatedSchema.safeParse(queryWithoutSort);
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
        NovelSearchPaginatedSchema.safeParse(queryWithWrongSort);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        sort: "desc(createdAt)",
      });
    });
  });
  describe("Status field", () => {
    it("Without status returns default ALL", () => {
      const { status, ...queryWithoutStatus } = query;
      const { success, data } =
        NovelSearchPaginatedSchema.safeParse(queryWithoutStatus);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        status: "ALL",
      });
    });

    it("Wrong status returns default ALL", () => {
      const queryWithWrongStatus = {
        ...query,
        status: "desc",
      };
      const { success, data } =
        NovelSearchPaginatedSchema.safeParse(queryWithWrongStatus);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        status: "ALL",
      });
    });
  });

  describe("Fields borrowed from existing fields", () => {
    it("Without search returns default ''", () => {
      const { search, ...queryWithoutSearch } = query;
      const { success, data } =
        NovelSearchPaginatedSchema.safeParse(queryWithoutSearch);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        search: "",
      });
    });

    it("Without page returns default 1", () => {
      const { page, ...queryWithoutPage } = query;
      const { success, data } =
        NovelSearchPaginatedSchema.safeParse(queryWithoutPage);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        page: 1,
      });
    });
  });

  it("NovelSearchSchema not paginated should ignore page", () => {
    const { page, ...queryWithoutPage } = query;
    const { success, data } = NovelSearchSchema.safeParse(queryWithoutPage);
    expect(success).toBe(true);
    expect(data).toMatchObject(queryWithoutPage);
  });

  it("Successfully parsed", () => {
    const { success, data } = NovelSearchPaginatedSchema.safeParse(query);

    expect(success).toBe(true);
    expect(data).toMatchObject(query);
  });

  it("Successfully parsed and ignored pageSize", () => {
    const { success, data } = NovelSearchPaginatedSchema.safeParse({
      ...query,
      pageSize: 30,
    });

    expect(success).toBe(true);
    expect(data).toMatchObject(query);
  });
});
