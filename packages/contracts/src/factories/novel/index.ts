import { z } from "zod";
import { GetFactory } from "../read-factory";
import {
  titleField,
  descriptionField,
  urlField,
  createIdField,
} from "../../schemas/fields";
import { AuthorThumbnailSchema } from "../../schemas/author/schema";
import { CategoryDetailSchema } from "../../schemas/category/schema";
import {
  createStringNumberToNumber,
  languageField,
  novelStatusField,
  novelTypeField,
  weekDayField,
} from "./fields";
import { isoStringToDate } from "../../schemas/date/schema";
import { createSortWithDirection } from "../../utils/createSortWithDirection";
import { TranslatorSchema } from "../translator";

const NovelDetailSchema = z.object({
  id: createIdField("Novel"),
  title: titleField,
  description: descriptionField,
  totalChapters: createStringNumberToNumber("Total chapters"),
  author: AuthorThumbnailSchema.nullish(),
  coverImageUrl: urlField.nullish(),
  coverImagePath: z.string().nullish(),
  release: isoStringToDate,
  type: novelTypeField,
  language: languageField,
  status: novelStatusField,
  schedule: weekDayField.array(),
  categories: z.array(CategoryDetailSchema),
  translator: TranslatorSchema.nullish(),
});

const NovelThumbnailSchema = z.object({
  id: NovelDetailSchema.shape["id"],
  title: NovelDetailSchema.shape["title"],
  coverImageUrl: NovelDetailSchema.shape["coverImageUrl"],
  description: NovelDetailSchema.shape["description"],
  translator: NovelDetailSchema.shape["translator"],
});

const NovelTrendSchema = z.object({
  id: NovelDetailSchema.shape["id"],
  title: NovelDetailSchema.shape["title"],
  coverImageUrl: NovelDetailSchema.shape["coverImageUrl"],
  totalChapters: NovelDetailSchema.shape["totalChapters"],
});

const NovelAuthSchema = z.object({
  id: NovelDetailSchema.shape["id"],
  translator: NovelDetailSchema.shape["translator"],
});

export const novelSort = ["createdAt", "updatedAt", "title"] as const;

export const novelSortField = z.enum(novelSort, {
  message: "Sort must be createdAt, updatedAt or title",
});

export const novelSortWithDirection = createSortWithDirection(novelSort);

const fullText = novelSortWithDirection
  .map((item, i, arr) =>
    i === 0 ? item : i === arr.length - 1 ? ` or ${item}` : `, ${item}`,
  )
  .join("");

export const novelSortWithDirectionField = z.enum(novelSortWithDirection, {
  message: `Sort must be ${fullText}`,
});

export const NovelDetailFactory = new GetFactory({ schema: NovelDetailSchema });
export const NovelThumbnailFactory = new GetFactory({
  schema: NovelThumbnailSchema,
});
export const NovelTrendFactory = new GetFactory({ schema: NovelTrendSchema });
export const NovelAuthFactory = new GetFactory({
  schema: NovelAuthSchema,
});
