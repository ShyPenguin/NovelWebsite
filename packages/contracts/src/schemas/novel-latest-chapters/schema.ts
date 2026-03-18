import { z } from "zod";
import { ChapterDetailSchema } from "../chapter/schema.js";
import { NovelDetailSchema } from "../novel/schema.js";

export const NovelLatestChaptersSchema = z.object({
  novel: z.object({
    id: NovelDetailSchema.shape["id"],
    title: NovelDetailSchema.shape["title"],
    coverImageUrl: NovelDetailSchema.shape["coverImageUrl"],
  }),
  id: ChapterDetailSchema.shape["id"],
  chapterNumber: ChapterDetailSchema.shape["chapterNumber"],
  title: ChapterDetailSchema.shape["title"],
  access: ChapterDetailSchema.shape["access"],
  status: ChapterDetailSchema.shape["status"],
  updatedAt: ChapterDetailSchema.shape["updatedAt"],
});
