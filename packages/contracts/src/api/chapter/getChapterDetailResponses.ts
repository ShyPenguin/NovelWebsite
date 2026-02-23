import { z } from "zod";
import { ChapterDetailSchema } from "../../schemas/chapter/schema";
import { getDefaultResponses } from "../../factories/response";

export const GetChapterDetailResponsesSchema =
  getDefaultResponses(ChapterDetailSchema);

export type GetChapterDetail200 = z.infer<
  (typeof GetChapterDetailResponsesSchema)[200]
>;
export type GetChapterDetail404 = z.infer<
  (typeof GetChapterDetailResponsesSchema)[404]
>;
export type GetChapterDetail500 = z.infer<
  (typeof GetChapterDetailResponsesSchema)[500]
>;
