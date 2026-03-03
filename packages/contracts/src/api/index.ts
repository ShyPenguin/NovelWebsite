import { ApiResponse } from "../factories/response";
import { ApiSuccess } from "../factories/response";
import { z } from "zod";
import { NovelLatestChaptersSchema } from "../schemas/novel-latest-chapters/schema";

export const ApiResponseSchema = ApiResponse;
export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export const GetNovelLatestChapters = z.object({
  free: z.array(NovelLatestChaptersSchema),
  paid: z.array(NovelLatestChaptersSchema),
});
