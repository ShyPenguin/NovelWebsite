import { z } from "zod";
import { chapterAccessField } from "../../factories/chapter/fields";
import {
  ChapterAuthFactory,
  ChapterDetailFactory,
  chapterSortWithDirectionField,
  ChapterThumbnailFactory,
} from "../../factories/chapter";

// READ
export const ChapterDetailSchema = ChapterDetailFactory.getSchema();
export const ChapterThumbnailSchema = ChapterThumbnailFactory.getSchema();
export const ChapterAuthSchema = ChapterAuthFactory.getSchema();

// READ - ARRAY AND PAGE
export const PaginatedChapterThumbnailSchema =
  ChapterThumbnailFactory.paginate();
export const ArrayChapterThumbnailSchema = ChapterThumbnailFactory.array();

// QUERY
export const ChapterSearchQueryContract = z.object({
  sort: chapterSortWithDirectionField.optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  access: chapterAccessField.optional(),
});

// WRITE
export const ChapterFormSchema = z.object({
  sourceDocUrl: ChapterDetailSchema.shape["sourceDocUrl"],
  chapterNumber: ChapterDetailSchema.shape["chapterNumber"],
  status: ChapterDetailSchema.shape["status"].optional().default("draft"),
  access: ChapterDetailSchema.shape["access"].optional().default("free"),
  publishedAt: ChapterDetailSchema.shape["publishedAt"],
});

export const ChapterPreviewSchema = z.object({
  sourceDocUrl: ChapterFormSchema.shape["sourceDocUrl"],
  chapterNumber: ChapterFormSchema.shape["chapterNumber"],
  title: ChapterDetailSchema.shape["title"],
  contentHtml: ChapterDetailSchema.shape["contentHtml"],
  status: ChapterFormSchema.shape["status"],
  access: ChapterFormSchema.shape["access"],
  publishedAt: ChapterFormSchema.shape["publishedAt"],
});
