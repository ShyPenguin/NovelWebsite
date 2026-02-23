import { AuthorQueryContract } from "@repo/contracts/schemas/author";
import { pageField, searchFieldExtend } from "../fields";
import type z from "zod";

export const AuthorSearchSchema = AuthorQueryContract.pick({
  page: true,
  search: true,
}).extend({
  page: pageField,
  search: searchFieldExtend,
});

export type AuthorSearchType = z.infer<typeof AuthorSearchSchema>;
export type AuthorSearchInput = z.input<typeof AuthorSearchSchema>;
