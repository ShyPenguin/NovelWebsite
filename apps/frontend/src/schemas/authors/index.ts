import { AuthorQueryContract } from "@repo/contracts/schemas/author";
import type z from "zod";
import { pageField, searchFieldExtend } from "../fields";

export const AUTHOR_SEARCH_DEFAULT = {
  page: 1,
  search: "",
};
export const AuthorSearchSchema = AuthorQueryContract.pick({
  page: true,
  search: true,
}).extend({
  page: pageField,
  search: searchFieldExtend,
});

export type AuthorSearchType = z.infer<typeof AuthorSearchSchema>;
export type AuthorSearchInput = z.input<typeof AuthorSearchSchema>;
