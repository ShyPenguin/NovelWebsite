import { StringSchemaBuilder } from "@/fields/builders/StringSchema.js";
import { createIdField, emailField, urlField } from "@/fields/general.js";
import { userRolesField, oAuthProvidersField } from "@/fields/user.fields.js";
import { createIsoStringToDateField } from "@/schemas/date/schema.js";
import { z } from "zod";

export const UserBaseSchema = z.object({
  id: createIdField("User"),
  email: emailField,
  name: new StringSchemaBuilder("Name").min(1).max(30).build(),
  username: new StringSchemaBuilder("Username").min(1).max(30).build(),
  role: userRolesField,
  imageUrl: urlField.nullish(),
  imagePath: z.string().nullish(),
  oAuthProviders: z.array(oAuthProvidersField),
  createdAt: createIsoStringToDateField("createdAt"),
  updatedAt: createIsoStringToDateField("updatedAt"),
});
