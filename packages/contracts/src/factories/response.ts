import { z } from "zod";
import { ApiErrorSchema } from "./error.js";
import { StatusMap } from "./status.js";

export const ApiResponse = <T extends z.ZodType>(data: T) =>
  z.discriminatedUnion("ok", [ApiSuccess(data), ApiError]);

export const ApiSuccess = <T extends z.ZodType>(data: T) =>
  z.object({
    ok: z.literal(true),
    data,
  });

export const ApiError = z.object({
  ok: z.literal(false),
  error: ApiErrorSchema,
});

//For documentation in the future if possible
export const getDefaultResponses = <T extends z.ZodType>(schema: T) =>
  StatusMap({
    200: ApiSuccess(schema),
    404: ApiError,
    500: ApiError,
  });

export const createDefaultResponse = <T extends z.ZodType>(schema: T) =>
  StatusMap({
    201: ApiSuccess(schema),
    400: ApiError,
    401: ApiError,
    403: ApiError,
    500: ApiError,
  });

export const updateDefaultResponse = <T extends z.ZodType>(schema: T) =>
  StatusMap({
    201: ApiSuccess(schema),
    400: ApiError,
    401: ApiError,
    403: ApiError,
    404: ApiError,
    500: ApiError,
  });
export const deleteDefaultResponse = <T extends z.ZodType>(schema: T) =>
  StatusMap({
    204: ApiSuccess(schema),
    400: ApiError,
    401: ApiError,
    403: ApiError,
    404: ApiError,
    500: ApiError,
  });
