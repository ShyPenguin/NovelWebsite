import { z } from "zod";
import { UserBaseSchema } from "../../base/user.base";
import { NovelBaseSchema } from "../../base/novel.base";
import { GetFactory } from "../read-factory";

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
  role: true,
  imageUrl: true,
});

export const userSort = ["name"] as const satisfies ReadonlyArray<
  keyof z.infer<typeof UserDetailSchema>
>;

export const UserDetailFactory = new GetFactory({ schema: UserDetailSchema });
export const UserThumbnailFactory = new GetFactory({
  schema: UserThumbnailSchema,
});
