import { z } from "zod";
import { NovelDetailSchema } from "../../schemas/novel/schema";
import { deleteDefaultResponse } from "../../factories/response";

export const DeleteNovelResponsesSchema =
  deleteDefaultResponse(NovelDetailSchema);

export type DeleteNovel204 = z.infer<(typeof DeleteNovelResponsesSchema)[204]>;
export type DeleteNovel400 = z.infer<(typeof DeleteNovelResponsesSchema)[400]>;
export type DeleteNovel401 = z.infer<(typeof DeleteNovelResponsesSchema)[401]>;
export type DeleteNovel403 = z.infer<(typeof DeleteNovelResponsesSchema)[403]>;
export type DeleteNovel404 = z.infer<(typeof DeleteNovelResponsesSchema)[404]>;
export type DeleteNovel500 = z.infer<(typeof DeleteNovelResponsesSchema)[500]>;
