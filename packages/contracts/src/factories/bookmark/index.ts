import { z } from "zod";
import { GetFactory } from "../read-factory.js";
import { NovelBaseSchema } from "@/base/novel.base.js";
import { UserBaseSchema } from "@/base/user.base.js";
import { NovelThumbnailFactory } from "../novel/index.js";
import { TranslatorSchema } from "../translator/index.js";

const BookmarkSchema = z.object({
  novelId: NovelBaseSchema.shape["id"],
  userId: UserBaseSchema.shape["id"],
});

const BookmarkDetailSchema = z.object({
  novel: NovelThumbnailFactory.getSchema().pick({
    id: true,
    title: true,
    slug: true,
    coverImageUrl: true,
    description: true,
  }),
  translator: TranslatorSchema.nullish(),
  userId: UserBaseSchema.shape["id"],
});
export const BookmarkAuthFactory = new GetFactory({
  schema: BookmarkSchema,
});

export const BookmarkDetailFactory = new GetFactory({
  schema: BookmarkDetailSchema,
});
