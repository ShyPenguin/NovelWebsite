import { BookmarkQueryContract } from "@repo/contracts/schemas/bookmark";
import type z from "zod";
import { pageField, searchFieldExtend } from "../../shared/schema";

export const BOOKMARK_SEARCH_DEFAULT = {
  page: 1,
  search: "",
};
export const BookmarkSearchSchema = BookmarkQueryContract.pick({
  page: true,
  search: true,
}).extend({
  page: pageField,
  search: searchFieldExtend,
});

export type BookmarkSearchType = z.infer<typeof BookmarkSearchSchema>;
export type BookmarkSearchInput = z.input<typeof BookmarkSearchSchema>;
