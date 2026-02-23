import {
  createIsoStringToDateField,
  createYyyyMmDdStringToDate,
} from "../../schemas/date/schema";
import {
  createDateField,
  createIdField,
  createUrlField,
  idField,
  titleField,
} from "../../schemas/fields";
import { NovelDetailSchema } from "../../schemas/novel/schema";
import { createSortWithDirection } from "../../utils/createSortWithDirection";
import { GetFactory } from "../read-factory";
import { TranslatorSchema } from "../translator";
import {
  chapterAccessField,
  chapterNumberField,
  chapterStatusField,
} from "./fields";
import { z } from "zod";

const ChapterDetailSchema = z.object({
  id: idField,
  novelId: NovelDetailSchema.shape["id"],
  chapterNumber: chapterNumberField,
  title: titleField,
  sourceDocUrl: createUrlField("Source document url"),
  publishedAt: createYyyyMmDdStringToDate("Published at").nullish(),
  createdAt: createIsoStringToDateField("createdAt"),
  updatedAt: createIsoStringToDateField("updatedAt"),
  contentHtml: z.string({
    error: (iss) =>
      iss.input === undefined || iss.input === null
        ? "Content is required"
        : "Content must be a string",
  }),
  access: chapterAccessField,
  status: chapterStatusField,
  translator: TranslatorSchema.nullish(),
  prevChapter: createIdField("prevChapter").nullish(),
  nextChapter: createIdField("nextChapter").nullish(),
});

const ChapterThumbnailSchema = z.object({
  id: ChapterDetailSchema.shape["id"],
  title: ChapterDetailSchema.shape["title"],
  chapterNumber: ChapterDetailSchema.shape["chapterNumber"],
  publishedAt: ChapterDetailSchema.shape["publishedAt"],
  updatedAt: ChapterDetailSchema.shape["updatedAt"],
  access: ChapterDetailSchema.shape["access"],
  status: ChapterDetailSchema.shape["status"],
});

const ChapterPosterSchema = z.object({
  id: ChapterDetailSchema.shape["id"],
  chapterNumber: ChapterDetailSchema.shape["chapterNumber"],
  novelId: ChapterDetailSchema.shape["novelId"],
  translator: ChapterDetailSchema.shape["translator"],
});

export const chapterSort = ["chapterNumber"] as const;
export const chapterSortWithDirection = createSortWithDirection(chapterSort);
const fullText = chapterSortWithDirection
  .map((item, i, arr) =>
    i === 0 ? item : i === arr.length - 1 ? ` or ${item}` : `, ${item}`,
  )
  .join("");

export const chapterSortWithDirectionField = z.enum(chapterSortWithDirection, {
  message: `Sort must be ${fullText}`,
});

export const ChapterDetailFactory = new GetFactory({
  schema: ChapterDetailSchema,
});
export const ChapterThumbnailFactory = new GetFactory({
  schema: ChapterThumbnailSchema,
});

export const ChapterPosterFactory = new GetFactory({
  schema: ChapterPosterSchema,
});
