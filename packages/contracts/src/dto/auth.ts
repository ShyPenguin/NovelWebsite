import { z } from "zod";
import {
  AuthDetailSchema,
  sessionSchema,
  userRoles,
} from "../schemas/auth/schema";

export type AuthDTO = z.infer<typeof AuthDetailSchema>;
export type UserRole = (typeof userRoles)[number];
export type UserSession = z.infer<typeof sessionSchema>;
