import { z } from "zod";
import { AuthDetailSchema } from "../../schemas/auth/schema";
import { createIdField } from "../../fields/fields";

export const TranslatorSchema = z.object({
  id: createIdField("Translator"),
  name: AuthDetailSchema.shape["name"],
});
