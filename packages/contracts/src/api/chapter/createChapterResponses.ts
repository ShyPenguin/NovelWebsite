import { createDefaultResponse } from "@/factories/response.js";
import { ChapterDetailSchema } from "@/schemas/chapter/schema.js";
import { z } from "zod";

export const CreateChapterResponsesSchema =
  createDefaultResponse(ChapterDetailSchema);

export type CreateChapter200 = z.infer<
  (typeof CreateChapterResponsesSchema)[201]
>;
export type CreateChapter400 = z.infer<
  (typeof CreateChapterResponsesSchema)[400]
>;
export type CreateChapter401 = z.infer<
  (typeof CreateChapterResponsesSchema)[401]
>;
export type CreateChapter403 = z.infer<
  (typeof CreateChapterResponsesSchema)[403]
>;
export type CreateChapter500 = z.infer<
  (typeof CreateChapterResponsesSchema)[500]
>;
