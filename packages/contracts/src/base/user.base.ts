import { z } from "zod";
import { StringSchemaBuilder } from "../fields/builders/StringSchema";
import { createIdField, emailField, urlField } from "../fields/general";
import { oAuthProvidersField, userRolesField } from "../fields/user.fields";
import { createIsoStringToDateField } from "../schemas/date/schema";

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
