import { z } from "zod";
import {
  chapterNumberField,
  contentField,
  docUrlField,
  titleField,
} from "./fields.ts";
import { ChapterSearchQueryContract } from "@repo/contracts/schemas/chapter";
import { pageField } from "./fieldsNew.ts";
import { NumberSchemaBuilder } from "@repo/contracts/fields/builders";
import { searchField } from "@repo/contracts/fields/general";

// Schema overrides page, pageSize, sort, and search,
// Schema shares access
export const ChapterQuerySchema = ChapterSearchQueryContract.pick({
  search: true,
  page: true,
  pageSize: true,
  sort: true,
  access: true,
}).extend({
  search: searchField.optional(),
  page: pageField.optional(),
  pageSize: new NumberSchemaBuilder("Page's size")
    .min(1)
    .max(100)
    .build()
    .optional(),
  sort: ChapterSearchQueryContract.shape["sort"].default("asc(chapterNumber)"),
});

export type ChapterQueryInput = z.input<typeof ChapterQuerySchema>;
export type ChapterQueryOutput = z.output<typeof ChapterQuerySchema>;

// export const ChapterUpdateFormSchema = z.object({
//   title: titleField.optional(),
//   content: contentField.optional(),
//   access: chapterAccessTypeField.optional(),
// });

export const ChapterUpdateFormSchema = z.object({
  title: titleField.optional(),
  content: contentField.optional(),
  access: ChapterQuerySchema.shape["access"].optional(),
  docUrl: docUrlField,
  chapterNumber: chapterNumberField,
});
