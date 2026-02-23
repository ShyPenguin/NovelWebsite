import { z } from "zod";
import { NovelDetailSchema } from "../../schemas/novel/schema";
import { createDefaultResponse } from "../../factories/response";

export const CreateNovelResponsesSchema =
  createDefaultResponse(NovelDetailSchema);

export type CreateNovel200 = z.infer<(typeof CreateNovelResponsesSchema)[201]>;
export type CreateNovel400 = z.infer<(typeof CreateNovelResponsesSchema)[400]>;
export type CreateNovel401 = z.infer<(typeof CreateNovelResponsesSchema)[401]>;
export type CreateNovel403 = z.infer<(typeof CreateNovelResponsesSchema)[403]>;
export type CreateNovel500 = z.infer<(typeof CreateNovelResponsesSchema)[500]>;
