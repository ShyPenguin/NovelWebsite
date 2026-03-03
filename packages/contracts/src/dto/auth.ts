import { z } from "zod";
import { AuthDetailSchema, sessionSchema } from "../schemas/auth/schema";
import { userRoles } from "../factories/users";

export type AuthDTO = z.infer<typeof AuthDetailSchema>;
export type UserRole = (typeof userRoles)[number];
export type UserSession = z.infer<typeof sessionSchema>;
