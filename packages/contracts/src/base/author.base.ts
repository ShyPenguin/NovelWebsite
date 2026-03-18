import { StringSchemaBuilder } from "@/fields/builders/StringSchema.js";
import { idField } from "@/fields/general.js";
import { z } from "zod";

export const AuthorBaseSchema = z.object({
  id: idField,
  name: new StringSchemaBuilder("Author's name").min(1).max(50).build(),
});
