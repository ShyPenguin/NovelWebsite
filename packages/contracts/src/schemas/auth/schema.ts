import { userRoles } from "../../factories/users";
import { StringSchemaBuilder } from "../../fields/builders/StringSchema";
import { z } from "zod";
import { emailField, idField, urlField } from "../../fields/fields";

export const AuthDetailSchema = z.object({
  id: idField,
  email: emailField,
  name: new StringSchemaBuilder("Name").min(1).max(50).build(),
  role: z.enum(userRoles, {
    message: "Roles must be user, admin or staff",
  }),
  imageUrl: urlField.nullable(),
});

export const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
});
