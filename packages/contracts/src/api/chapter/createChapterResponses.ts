import { z } from "zod";
import { ChapterDetailSchema } from "../../schemas/chapter/schema";
import { createDefaultResponse } from "../../factories/response";

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
