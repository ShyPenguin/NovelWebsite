import { z } from "zod";
import { AuthDetailSchema, sessionSchema } from "../schemas/auth/schema";
import { oAuthProviders, userRoles } from "../fields/user.fields";

export type AuthDTO = z.infer<typeof AuthDetailSchema>;
export type UserRole = (typeof userRoles)[number];
export type OAuthProviders = (typeof oAuthProviders)[number];
export type UserSession = z.infer<typeof sessionSchema>;
