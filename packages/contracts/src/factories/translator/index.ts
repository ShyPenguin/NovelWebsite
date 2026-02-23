import { z } from "zod";
import { AuthDetailSchema } from "../../schemas/auth/schema";
import { createIdField } from "../../schemas/fields";

export const TranslatorSchema = z.object({
  id: createIdField("Translator"),
  name: AuthDetailSchema.shape["name"],
});
