import { UserRole } from "@repo/contracts/dto/auth";
import { userRoles } from "@repo/contracts/schemas/auth";
import { Request } from "express";
import { z } from "zod";
// Extend Express Request type to include userId
export type ActionTypes = "get" | "delete" | "create" | "update" | "preview";

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

export const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
});

export const providerSchema = z.object({
  provider: z.enum(["google", "discord", "github"]),
});

export type UserSession = z.infer<typeof sessionSchema>;

type CookieOptions = {
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax";
  expires?: number;
};

export type Cookies = {
  set: (key: string, value: string, options: CookieOptions) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};
