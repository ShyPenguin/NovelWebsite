import { z } from "zod";
import {
  CategoryDetailSchema,
  CategoryFormSchema,
} from "../schemas/category/schema";

export type CategoryDetailDTO = z.infer<typeof CategoryDetailSchema>;
export type CategoryFormDTO = z.infer<typeof CategoryFormSchema>;
