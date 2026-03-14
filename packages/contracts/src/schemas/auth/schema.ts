import { z } from "zod";
import { userRoles } from "../../fields/user.fields";
import { UserBaseSchema } from "../../base/user.base";

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
