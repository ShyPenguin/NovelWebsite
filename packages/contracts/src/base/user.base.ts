import { z } from "zod";
import { StringSchemaBuilder } from "../fields/builders/StringSchema";
import { createIdField, emailField, urlField } from "../fields/general";
import {
  oAuthProviders,
  oAuthProvidersField,
  userRolesField,
} from "../fields/user.fields";

export const UserBaseSchema = z.object({
  id: createIdField("User"),
  email: emailField,
  name: new StringSchemaBuilder("Name").min(1).max(50).build(),
  role: userRolesField,
  imageUrl: urlField.nullable(),
  oAuthProviders: z.array(oAuthProvidersField),
});
