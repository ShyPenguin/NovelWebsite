import { z } from "zod";
import { StringSchemaBuilder } from "../../fields/builders/StringSchema";
import { createIdField, emailField, urlField } from "../../fields/fields";

export const userRoles = ["user", "staff", "supervisor", "admin"] as const;
export const oauthProviders = ["google", "discord"] as const;

export const UserDetailSchema = z.object({
  id: createIdField("User"),
  email: emailField,
  name: new StringSchemaBuilder("Name").min(1).max(50).build(),
  role: z.enum(userRoles, {
    message: "Roles must be user, staff, supervisor, or admin",
  }),
  imageUrl: urlField.nullable(),
  oauthProviders: z.array(
    z.enum(oauthProviders, {
      message: "Providers must be google or discord",
    }),
  ),
});
