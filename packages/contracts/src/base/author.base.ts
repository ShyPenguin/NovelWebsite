import { z } from "zod";
import { StringSchemaBuilder } from "../fields/builders/StringSchema";
import { idField } from "../fields/fields";

export const AuthorBaseSchema = z.object({
  id: idField,
  name: new StringSchemaBuilder("Author's name").min(1).max(50).build(),
});
