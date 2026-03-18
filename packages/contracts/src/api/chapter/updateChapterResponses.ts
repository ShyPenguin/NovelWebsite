import { updateDefaultResponse } from "@/factories/response.js";
import { ChapterDetailSchema } from "@/schemas/chapter/schema.js";
import { z } from "zod";

export const UpdateChapterResponsesSchema =
  updateDefaultResponse(ChapterDetailSchema);

export type UpdateChapter201 = z.infer<
  (typeof UpdateChapterResponsesSchema)[201]
>;
export type UpdateChapter400 = z.infer<
  (typeof UpdateChapterResponsesSchema)[400]
>;
export type UpdateChapter401 = z.infer<
  (typeof UpdateChapterResponsesSchema)[401]
>;
export type UpdateChapter403 = z.infer<
  (typeof UpdateChapterResponsesSchema)[403]
>;
export type UpdateChapter404 = z.infer<
  (typeof UpdateChapterResponsesSchema)[404]
>;
export type UpdateChapter500 = z.infer<
  (typeof UpdateChapterResponsesSchema)[500]
>;
