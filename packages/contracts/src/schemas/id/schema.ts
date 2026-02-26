import { idField } from "../fields";
import { z } from "zod";

export const idFieldSchema = idField;
export const idSchema = z.object({
  id: idField,
});
