import { z } from "zod";
import { idField } from "../../schemas/fields";
import { GetFactory } from "../read-factory";
import { StringSchemaBuilder } from "../../fields/builders/StringSchema";

// FIELDS
const authorNameField = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Author's name is required"
        : "Author's name must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for Author's name" })
  .max(50, { message: "50 Letters Maximum for Author's name" });

//READ
const AuthorSchema = z.object({
  id: idField,
  name: new StringSchemaBuilder("Author's name").min(1).max(50).build(),
});

export const AuthorFactory = new GetFactory({ schema: AuthorSchema });
