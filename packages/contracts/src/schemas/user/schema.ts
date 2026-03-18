import {
  UserDetailFactory,
  UserThumbnailFactory,
  userSortWithDirectionField,
} from "@/factories/users/index.js";
import { userRolesQueryField } from "@/fields/user.fields.js";
import { z } from "zod";

// READ
export const UserDetailSchema = UserDetailFactory.getSchema();
export const UserThumbnailSchema = UserThumbnailFactory.getSchema();

// READ - ARRAY
export const ArrayUserDetailSchema = UserDetailFactory.array();
export const ArrayUserThumbnailSchema = UserThumbnailFactory.array();

// READ - PAGINATED
export const PaginatedUserDetailSchema = UserDetailFactory.paginate();
export const PaginatedUserThumbnailSchema = UserThumbnailFactory.paginate();

// WRITE
export const UserFormSchema = z.object({
  name: UserDetailSchema.shape["name"],
});

export const UserRoleChangeSchema = z.object({
  role: UserDetailSchema.shape["role"].optional().default("user"),
});

export const UserQueryContract = z.object({
  sort: userSortWithDirectionField.optional(),
  role: userRolesQueryField.optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});
