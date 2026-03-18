import { idField } from "@/fields/general.js";
import { z } from "zod";

export const idFieldSchema = idField;
export const idSchema = z.object({
  id: idField,
});
