import { z } from "zod";
import { idField } from "../../fields/general";

export const idFieldSchema = idField;
export const idSchema = z.object({
  id: idField,
});
