import { ChapterSearchQueryContractDTO } from "@/dto/chapter.js";
import { ChapterSearchQueryContract } from "@/schemas/chapter/schema.js";
import { expect, describe, it } from "vitest";

import { z } from "zod";
const query = {
  sort: "asc(chapterNumber)",
  search: "1",
  page: 20,
  pageSize: 40,
  access: "free",
} satisfies ChapterSearchQueryContractDTO;

describe("Chapter Query", () => {
  describe("Sort field", () => {
    it("Without sort returns success without sort", () => {
      const { sort, ...queryWithoutSort } = query;
      const { success, data } =
        ChapterSearchQueryContract.safeParse(queryWithoutSort);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutSort);
    });

    it("Wrong sort returns an error", () => {
      const queryWithWrongSort = {
        ...query,
        sort: "asc",
      };
      const { success, error } =
        ChapterSearchQueryContract.safeParse(queryWithWrongSort);
      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.fieldErrors.sort?.[0]).toBe(
        "Sort must be either asc(chapterNumber) or desc(chapterNumber)",
      );
    });
  });
  describe("Search field", () => {
    it("Without search returns success", () => {
      const { search, ...queryWithoutSearch } = query;
      const { success, data } =
        ChapterSearchQueryContract.safeParse(queryWithoutSearch);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutSearch);
    });

    it("Wrong search returns error", () => {
      const queryWithWrongSearch = {
        ...query,
        search: 123,
      };
      const { success } =
        ChapterSearchQueryContract.safeParse(queryWithWrongSearch);
      expect(success).toBe(false);
    });
  });
  describe("Page field", () => {
    it("Without page returns success ", () => {
      const { page, ...queryWithoutPage } = query;
      const { success, data } =
        ChapterSearchQueryContract.safeParse(queryWithoutPage);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutPage);
    });

    it("Wrong page returns false", () => {
      const queryWithWrongPage = {
        ...query,
        page: "what",
      };
      const { success, error } =
        ChapterSearchQueryContract.safeParse(queryWithWrongPage);
      expect(success).toBe(false);
    });
    it("Page coerces string digit correctly", () => {
      const queryWithWrongPage = {
        ...query,
        page: "2",
      };
      const { success, data } =
        ChapterSearchQueryContract.safeParse(queryWithWrongPage);
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        page: 2,
      });
    });
  });
  describe("PageSize field", () => {
    it("Without pageSize returns success", () => {
      const { pageSize, ...queryWithoutPageSize } = query;
      const { success, data } =
        ChapterSearchQueryContract.safeParse(queryWithoutPageSize);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutPageSize);
    });

    it("Wrong pageSize returns default 30", () => {
      const queryWithWrongPageSize = {
        ...query,
        pageSize: "what",
      };
      const { success, error } = ChapterSearchQueryContract.safeParse(
        queryWithWrongPageSize,
      );
      expect(success).toBe(false);
    });
    it("PageSize coerces string digit correctly", () => {
      const queryWithWrongPageSize = {
        ...query,
        pageSize: "40",
      };
      const { success, data } = ChapterSearchQueryContract.safeParse(
        queryWithWrongPageSize,
      );
      expect(success).toBe(true);
      expect(data).toMatchObject({
        ...query,
        pageSize: 40,
      });
    });
  });
  describe("Access field", () => {
    it("Without access returns success", () => {
      const { access, ...queryWithoutAccess } = query;
      const { success, data } =
        ChapterSearchQueryContract.safeParse(queryWithoutAccess);
      expect(success).toBe(true);
      expect(data).toMatchObject(queryWithoutAccess);
    });

    it("Wrong access returns default free", () => {
      const queryWithWrongAccess = {
        ...query,
        access: "what",
      };
      const { success, error } =
        ChapterSearchQueryContract.safeParse(queryWithWrongAccess);
      expect(success).toBe(false);
    });
  });

  it("Successfully parsed", () => {
    const { success, data } = ChapterSearchQueryContract.safeParse(query);

    expect(success).toBe(true);
    expect(data).toMatchObject(query);
  });
});
