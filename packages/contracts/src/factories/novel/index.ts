import { z } from "zod";
import { GetFactory } from "../read-factory";
import { createSortWithDirection } from "../../utils/createSortWithDirection";
import { TranslatorSchema } from "../translator";
import { NovelBaseSchema } from "../../base/novel.base";
import { AuthorBaseSchema } from "../../base/author.base";
import { CategoryBaseSchema } from "../../base/category.base";

const NovelThumbnailSchema = NovelBaseSchema.pick({
  id: true, //
  title: true, //
  coverImageUrl: true, //
  description: true, //
}).extend({
  translator: TranslatorSchema.nullish(), //
});

const NovelTrendSchema = NovelBaseSchema.pick({
  id: true,
  title: true,
  coverImageUrl: true,
  totalChapters: true,
});

const NovelAuthSchema = NovelThumbnailSchema.pick({
  id: true,
  translator: true,
});

const NovelDetailSchema = NovelBaseSchema.pick({
  id: true, //
  title: true, //
  coverImageUrl: true, //
  coverImagePath: true,
  description: true, //
  totalChapters: true, //
  release: true, //
  type: true, //
  language: true, //
  status: true, //
  schedule: true, //
}).extend({
  translator: NovelThumbnailSchema.shape["translator"], //
  author: AuthorBaseSchema.pick({
    id: true,
    name: true,
  }).nullish(), //
  categories: z.array(CategoryBaseSchema),
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

export const NovelThumbnailFactory = new GetFactory({
  schema: NovelThumbnailSchema,
});
export const NovelTrendFactory = new GetFactory({ schema: NovelTrendSchema });
export const NovelAuthFactory = new GetFactory({
  schema: NovelAuthSchema,
});

export const NovelDetailFactory = new GetFactory({ schema: NovelDetailSchema });
