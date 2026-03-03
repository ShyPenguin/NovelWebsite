import { z } from "zod";
import { idField } from "../../fields/fields";

export const idFieldSchema = idField;
export const idSchema = z.object({
  id: idField,
});
