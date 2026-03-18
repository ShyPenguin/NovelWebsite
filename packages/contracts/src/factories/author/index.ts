import { AuthorBaseSchema } from "@/base/author.base.js";
import { NovelBaseSchema } from "@/base/novel.base.js";
import { z } from "zod";
import { GetFactory } from "../read-factory.js";

//READ
const AuthorThumbnailSchema = AuthorBaseSchema.pick({
  id: true,
  name: true,
});

const AuthorDetailSchema = AuthorThumbnailSchema.extend({
  novels: z.array(
    NovelBaseSchema.pick({
      id: true,
      title: true,
      coverImageUrl: true,
      description: true,
    }),
  ),
});

export const AuthorFactory = new GetFactory({ schema: AuthorThumbnailSchema });

export const AuthorDetailFactory = new GetFactory({
  schema: AuthorDetailSchema,
});
