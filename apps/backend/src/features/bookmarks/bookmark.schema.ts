import { pageField } from "@/shared/validations/fields.js";
import { NumberSchemaBuilder } from "@repo/contracts/fields/builders";
import { BookmarkQueryContract } from "@repo/contracts/schemas/bookmark";
import z from "zod";

export const BookmarkQuerySchema = BookmarkQueryContract.pick({
  page: true,
  pageSize: true,
}).extend({
  page: pageField.optional(),
  pageSize: new NumberSchemaBuilder("Page's size")
    .min(1)
    .max(100)
    .build()
    .optional(),
});

export type BookmarkQueryInput = z.input<typeof BookmarkQuerySchema>;
export type BookmarkQueryOutput = z.output<typeof BookmarkQuerySchema>;
