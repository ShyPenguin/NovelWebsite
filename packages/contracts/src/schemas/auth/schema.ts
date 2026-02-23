import { StringSchemaBuilder } from "../../fields/builders/StringSchema";
import { idField, urlField } from "../fields";
import { z } from "zod";

export const userRoles = ["user", "admin", "staff"] as const;

export const AuthDetailSchema = z.object({
  id: idField,
  email: z.email(),
  name: new StringSchemaBuilder("Name").min(1).max(50).build(),
  role: z.enum(userRoles, {
    message: "Roles must be user, admin or staff",
  }),
  imageUrl: urlField.nullable(),
});
