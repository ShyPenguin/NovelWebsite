import { ChapterDetailSchema } from "../chapter/schema";
import { NovelDetailSchema } from "../novel/schema";
import { z } from "zod";

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
