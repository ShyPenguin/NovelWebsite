import { z } from "zod";

export const ApiErrorSchema = z.object({
  type: z.string(),
  path: z.string(),
  statusCode: z.number(),
  message: z.string(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
