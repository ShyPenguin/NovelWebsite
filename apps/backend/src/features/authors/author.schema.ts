import { z } from "zod";
import { AuthorQueryContract } from "@repo/contracts/schemas/author";
import { searchField } from "@repo/contracts/fields/general";
import { NumberSchemaBuilder } from "@repo/contracts/fields/builders";
import { pageField } from "../../shared/validations/fields.ts";

export const AuthorQuerySchema = AuthorQueryContract.pick({
  page: true,
  pageSize: true,
  search: true,
}).extend({
  search: searchField.optional(),
  page: pageField.optional(),
  pageSize: new NumberSchemaBuilder("Page's size")
    .min(1)
    .max(100)
    .build()
    .optional(),
});

export type AuthorQueryInput = z.input<typeof AuthorQuerySchema>;
export type AuthorQueryOutput = z.output<typeof AuthorQuerySchema>;
