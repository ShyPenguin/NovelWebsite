import { z } from "zod";
import { createIdField, idField, titleField } from "../../schemas/fields";
import { GetFactory } from "../read-factory";
import { StringSchemaBuilder } from "../../fields/builders/StringSchema";

//READ
const AuthorThumbnailSchema = z.object({
  id: idField,
  name: new StringSchemaBuilder("Author's name").min(1).max(50).build(),
});

const AuthorDetailSchema = z.object({
  id: AuthorThumbnailSchema.shape["id"],
  name: AuthorThumbnailSchema.shape["name"],
  novels: z.array(
    z.object({
      id: createIdField("Novel"),
      title: titleField,
    }),
  ),
});
export const AuthorFactory = new GetFactory({ schema: AuthorThumbnailSchema });
export const AuthorDetailFactory = new GetFactory({
  schema: AuthorDetailSchema,
});
