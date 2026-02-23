import { z } from "zod";
import { idField } from "../../schemas/fields";
import { GetFactory } from "../read-factory";

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
  name: authorNameField,
});

export const AuthorFactory = new GetFactory({ schema: AuthorSchema });
