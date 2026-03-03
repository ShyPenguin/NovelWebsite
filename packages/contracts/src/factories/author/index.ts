import { z } from "zod";
import { GetFactory } from "../read-factory";
import { NovelBaseSchema } from "../../base/novel.base";
import { AuthorBaseSchema } from "../../base/author.base";

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
