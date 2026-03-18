import { createIdField } from "@/fields/general.js";
import { AuthDetailSchema } from "@/schemas/auth/schema.js";
import { z } from "zod";

export const TranslatorSchema = z.object({
  id: createIdField("Translator"),
  name: AuthDetailSchema.shape["name"],
});
