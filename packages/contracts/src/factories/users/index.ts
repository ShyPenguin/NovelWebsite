import { z } from "zod";
import { UserBaseSchema } from "../../base/user.base";
import { NovelBaseSchema } from "../../base/novel.base";
import { GetFactory } from "../read-factory";
import {
  createSortWithDirection,
  createSortWithDirectionField,
} from "../../utils/createSortWithDirection";

const UserDetailSchema = UserBaseSchema.extend({
  novels: z.array(
    NovelBaseSchema.pick({
      id: true,
      title: true,
      coverImageUrl: true,
      description: true,
    }),
  ),
});

const UserThumbnailSchema = UserBaseSchema.pick({
  id: true,
  email: true,
  name: true,
  username: true,
  role: true,
  imageUrl: true,
  imagePath: true,
  createdAt: true,
  updatedAt: true,
  oAuthProviders: true,
});

export const userSort = [
  "createdAt",
  "updatedAt",
  "name",
  "username",
] as const satisfies ReadonlyArray<keyof z.infer<typeof UserDetailSchema>>;

export const userSortWithDirection = createSortWithDirection(userSort);

export const userSortWithDirectionField =
  createSortWithDirectionField(userSort);

export const UserDetailFactory = new GetFactory({ schema: UserDetailSchema });
export const UserThumbnailFactory = new GetFactory({
  schema: UserThumbnailSchema,
});
