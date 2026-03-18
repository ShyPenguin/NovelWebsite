import { ApiResponse } from "@/factories/response.js";
import { NovelLatestChaptersSchema } from "@/schemas/novel-latest-chapters/schema.js";
import { z } from "zod";

export const ApiResponseSchema = ApiResponse;
export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export const GetNovelLatestChapters = z.object({
  free: z.array(NovelLatestChaptersSchema),
  paid: z.array(NovelLatestChaptersSchema),
});
