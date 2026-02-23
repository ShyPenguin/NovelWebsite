import { z } from "zod";
import { ChapterDetailSchema } from "../../schemas/chapter/schema";
import { deleteDefaultResponse } from "../../factories/response";

export const DeleteChapterResponsesSchema =
  deleteDefaultResponse(ChapterDetailSchema);

export type DeleteChapter204 = z.infer<
  (typeof DeleteChapterResponsesSchema)[204]
>;
export type DeleteChapter400 = z.infer<
  (typeof DeleteChapterResponsesSchema)[400]
>;
export type DeleteChapter401 = z.infer<
  (typeof DeleteChapterResponsesSchema)[401]
>;
export type DeleteChapter403 = z.infer<
  (typeof DeleteChapterResponsesSchema)[403]
>;
export type DeleteChapter404 = z.infer<
  (typeof DeleteChapterResponsesSchema)[404]
>;
export type DeleteChapter500 = z.infer<
  (typeof DeleteChapterResponsesSchema)[500]
>;
