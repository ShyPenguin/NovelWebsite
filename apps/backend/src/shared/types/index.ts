import { UserRole } from "@repo/contracts/dto/auth";
import { oAuthProviders } from "@repo/contracts/fields/users";
import { Request } from "express";
import { z } from "zod";

export const serviceErrorToHttpMap = {
  validation: 400,
  authentication: 401,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
  database: 500,
  unknown: 500,
} as const;

// Derive error types from the map keys
export type ServiceErrorType = keyof typeof serviceErrorToHttpMap;

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; type: ServiceErrorType; message: string };

export interface AuthRequest extends Request {
  user: { id: string; role: UserRole };
}

export const providerSchema = z.object({
  provider: z.enum(oAuthProviders),
});

type CookieOptions = {
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  expires?: number;
  path?: string
};

export type Cookies = {
  set: (key: string, value: string, options: CookieOptions) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};
