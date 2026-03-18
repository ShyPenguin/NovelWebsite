import {
  CategoryDetailSchema,
  CategoryFormSchema,
} from "@/schemas/category/schema.js";
import { z } from "zod";

export type CategoryDetailDTO = z.infer<typeof CategoryDetailSchema>;
export type CategoryFormDTO = z.infer<typeof CategoryFormSchema>;
