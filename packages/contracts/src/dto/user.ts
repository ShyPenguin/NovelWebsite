import { z } from "zod";
import {
  UserDetailSchema,
  UserFormSchema,
  UserRoleChangeSchema,
  UserThumbnailSchema,
} from "../schemas/user/schema";

//TYPES OF DATA TO READ
export type UserSelectDTO = "detail" | "thumbnail";

//READ
export type UserDetailDTO = z.infer<typeof UserDetailSchema>;
export type UserDetailEncodeDTO = z.input<typeof UserDetailSchema>;
export type UserThumbnailDTO = z.infer<typeof UserThumbnailSchema>;
export type UserThumbnailEncodeDTO = z.input<typeof UserThumbnailSchema>;

// LISTABLE TYPES (ARRAY OR PAGINATION)
export type UserListDTO = Extract<UserSelectDTO, "thumbnail">;
// WRITE
export type UserFormDTO = z.infer<typeof UserFormSchema>;
export type UserChangeRoleDTO = z.infer<typeof UserRoleChangeSchema>;
