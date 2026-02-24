import { z } from "zod";
import { idField } from "../../schemas/fields";
import { GetFactory } from "../read-factory";
import { StringSchemaBuilder } from "../../fields/builders/StringSchema";

//READ
const AuthorSchema = z.object({
  id: idField,
  name: new StringSchemaBuilder("Author's name").min(1).max(50).build(),
});

export const AuthorFactory = new GetFactory({ schema: AuthorSchema });
