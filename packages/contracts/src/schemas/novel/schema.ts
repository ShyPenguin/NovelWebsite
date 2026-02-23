import { z } from "zod";
import { titleField, descriptionField, createDateField } from "../fields";
import {
  weekDayField,
  novelStatusQueryField,
} from "../../factories/novel/fields";
import {
  NovelDetailFactory,
  NovelPosterFactory,
  novelSortWithDirectionField,
  NovelThumbnailFactory,
  NovelTrendFactory,
} from "../../factories/novel";
import { getFormattedDate } from "../../utils/export/getFormattedDate";

// READ
export const NovelDetailSchema = NovelDetailFactory.getSchema();
export const NovelThumbnailSchema = NovelThumbnailFactory.getSchema();
export const NovelTrendSchema = NovelTrendFactory.getSchema();
export const NovelPosterSchema = NovelPosterFactory.getSchema();

// READ - ARRAY
export const ArrayNovelDetailSchema = NovelDetailFactory.array();
export const ArrayNovelThumbnailSchema = NovelThumbnailFactory.array();
export const ArrayNovelTrendSchema = NovelTrendFactory.array();
export const ArrayNovelPosterSchema = NovelPosterFactory.array();

// READ - PAGINATE
export const PaginatedNovelDetailSchema = NovelDetailFactory.paginate();
export const PaginatedNovelThumbnailSchema = NovelThumbnailFactory.paginate();
export const PaginatedNovelTrendSchema = NovelTrendFactory.paginate();
export const PaginatedNovelPosterSchema = NovelPosterFactory.paginate();

// WRITE
export const NovelFormSchema = z.object({
  title: titleField,
  authorId: z.uuid({
    error: (iss) =>
      iss.input === undefined || iss.input === null || iss.input === ""
        ? "Author is required"
        : "Author's value must be in UUID form",
  }),
  description: descriptionField,
  type: NovelDetailSchema.shape["type"].optional().default("translated"),
  language: NovelDetailSchema.shape["language"].optional().default("korean"),
  status: NovelDetailSchema.shape["status"].optional().default("ONGOING"),
  release: createDateField("Release")
    .optional()
    .default(getFormattedDate(new Date())),
  schedule: weekDayField.array().optional().default([]),
  categories: z
    .array(
      z.uuid({
        error: (iss) =>
          iss.input === undefined || iss.input === null || iss.input === ""
            ? "Category is required"
            : "Category's value must be in UUID form",
      }),
    )
    .optional()
    .default([]),
});

export const NovelQueryContract = z.object({
  sort: novelSortWithDirectionField.optional(),
  status: novelStatusQueryField.optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});
