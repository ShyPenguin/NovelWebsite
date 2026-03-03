import { ChapterBaseSchema } from "../../base/chapter.base";
import { NovelBaseSchema } from "../../base/novel.base";
import { createSortWithDirection } from "../../utils/createSortWithDirection";
import { GetFactory } from "../read-factory";
import { TranslatorSchema } from "../translator";
import { z } from "zod";

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

export const ChapterThumbnailFactory = new GetFactory({
  schema: ChapterThumbnailSchema,
});

export const ChapterAuthFactory = new GetFactory({
  schema: ChapterAuthSchema,
});

export const ChapterDetailFactory = new GetFactory({
  schema: ChapterDetailSchema,
});
