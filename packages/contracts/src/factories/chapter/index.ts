import { ChapterBaseSchema } from "@/base/chapter.base.js";
import { NovelBaseSchema } from "@/base/novel.base.js";
import {
  createSortWithDirection,
  createSortWithDirectionField,
} from "@/utils/createSortWithDirection.js";
import { z } from "zod";
import { GetFactory } from "../read-factory.js";
import { TranslatorSchema } from "../translator/index.js";

const ChapterAuthSchema = ChapterBaseSchema.pick({
  id: true,
}).extend({
  translator: TranslatorSchema.nullish(),
  novelId: NovelBaseSchema.shape["id"],
});
const ChapterThumbnailSchema = ChapterBaseSchema.pick({
  id: true,
  title: true,
  chapterNumber: true,
  publishedAt: true,
  updatedAt: true,
  access: true,
  status: true,
}).extend({
  translator: ChapterAuthSchema.shape["translator"],
});

const ChapterDetailSchema = ChapterBaseSchema.pick({
  id: true,
  title: true,
  chapterNumber: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  access: true,
  status: true,
  sourceDocUrl: true,
  contentHtml: true,
  prevChapter: true,
  nextChapter: true,
}).extend({
  novelId: ChapterAuthSchema.shape["novelId"],
  translator: ChapterAuthSchema.shape["translator"],
});

export const chapterSort = ["chapterNumber"] as const satisfies ReadonlyArray<
  keyof z.infer<typeof ChapterDetailSchema>
>;
export const chapterSortWithDirection = createSortWithDirection(chapterSort);

export const chapterSortWithDirectionField =
  createSortWithDirectionField(chapterSort);

export const ChapterThumbnailFactory = new GetFactory({
  schema: ChapterThumbnailSchema,
});

export const ChapterAuthFactory = new GetFactory({
  schema: ChapterAuthSchema,
});

export const ChapterDetailFactory = new GetFactory({
  schema: ChapterDetailSchema,
});
