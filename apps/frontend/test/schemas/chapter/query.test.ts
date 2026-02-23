import { expect, describe, it } from "vitest";
import {
  ChapterSearchSchema,
  ChapterSearchType,
} from "../../../src/schemas/chapters/index";

const query = {
  sort: "asc",
  search: "1",
  page: 2,
} satisfies ChapterSearchType;

describe("Chapter Query", () => {
  describe("Sort field", () => {
    it("Without sort returns default desc", () => {
      const { sort, ...queryWithoutSort } = query;
      const { success, data } = ChapterSearchSchema.safeParse(queryWithoutSort);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        sort: "desc",
      });
    });

    it("Wrong sort returns default desc", () => {
      const queryWithWrongSort = {
        ...query,
        sort: "what",
      };
      const { success, data } =
        ChapterSearchSchema.safeParse(queryWithWrongSort);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        sort: "desc",
      });
    });
  });
  describe("Fields borrowed from existing fields", () => {
    it("Without search returns default ''", () => {
      const { search, ...queryWithoutSearch } = query;
      const { success, data } =
        ChapterSearchSchema.safeParse(queryWithoutSearch);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        search: "",
      });
    });

    it("Without page returns default 1", () => {
      const { page, ...queryWithoutPage } = query;
      const { success, data } = ChapterSearchSchema.safeParse(queryWithoutPage);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        page: 1,
      });
    });
  });
  it("Successfully parsed", () => {
    const { success, data } = ChapterSearchSchema.safeParse(query);

    expect(success).toBe(true);
    expect(data).toMatchObject(query);
  });

  it("Successfully parsed and ignored access", () => {
    const { success, data } = ChapterSearchSchema.safeParse({
      ...query,
      access: "desc",
    });

    expect(success).toBe(true);
    expect(data).toMatchObject(query);
  });
});
