import { updateDefaultResponse } from "@/factories/response.js";
import { NovelDetailSchema } from "@/schemas/novel/schema.js";
import { z } from "zod";

export const UpdateNovelResponsesSchema =
  updateDefaultResponse(NovelDetailSchema);

export type UpdateNovel201 = z.infer<(typeof UpdateNovelResponsesSchema)[201]>;
export type UpdateNovel400 = z.infer<(typeof UpdateNovelResponsesSchema)[400]>;
export type UpdateNovel401 = z.infer<(typeof UpdateNovelResponsesSchema)[401]>;
export type UpdateNovel403 = z.infer<(typeof UpdateNovelResponsesSchema)[403]>;
export type UpdateNovel404 = z.infer<(typeof UpdateNovelResponsesSchema)[404]>;
export type UpdateNovel500 = z.infer<(typeof UpdateNovelResponsesSchema)[500]>;
