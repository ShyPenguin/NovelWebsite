import { z } from "zod";
import { AuthDetailSchema, userRoles } from "../schemas/auth/schema";

export type AuthDTO = z.infer<typeof AuthDetailSchema>;
export type UserRole = (typeof userRoles)[number];
