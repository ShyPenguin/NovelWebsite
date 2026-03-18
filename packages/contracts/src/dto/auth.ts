import type { userRoles, oAuthProviders } from "@/fields/user.fields.js";
import type { AuthDetailSchema, sessionSchema } from "@/schemas/auth/schema.js";
import { z } from "zod";

export type AuthDTO = z.infer<typeof AuthDetailSchema>;
export type UserRole = (typeof userRoles)[number];
export type OAuthProviders = (typeof oAuthProviders)[number];
export type UserSession = z.infer<typeof sessionSchema>;
