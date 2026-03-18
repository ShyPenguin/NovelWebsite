import { getDefaultResponses } from "@/factories/response.js";
import { PaginatedChapterThumbnailSchema } from "@/schemas/chapter/schema.js";
import { z } from "zod";

export const GetPaginatedChapterThumbnailResponsesSchema = getDefaultResponses(
  PaginatedChapterThumbnailSchema,
);

export type GetPaginatedChapterThumbnail200 = z.infer<
  (typeof GetPaginatedChapterThumbnailResponsesSchema)[200]
>;
export type GetPaginatedChapterThumbnail404 = z.infer<
  (typeof GetPaginatedChapterThumbnailResponsesSchema)[404]
>;
export type GetPaginatedChapterThumbnail500 = z.infer<
  (typeof GetPaginatedChapterThumbnailResponsesSchema)[500]
>;
