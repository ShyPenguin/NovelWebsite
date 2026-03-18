import { UserBaseSchema } from "@/base/user.base.js";
import { userRoles } from "@/fields/user.fields.js";
import { z } from "zod";

export const AuthDetailSchema = UserBaseSchema.pick({
  id: true,
  email: true,
  name: true,
  role: true,
  imageUrl: true,
  username: true,
});
export const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
});
