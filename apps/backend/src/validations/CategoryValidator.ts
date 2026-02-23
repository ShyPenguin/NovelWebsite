import { z } from "zod";
import { categoryNameField, idField, pageField } from "./fields.ts";

export const CategoryFormSchema = z.object({
  name: categoryNameField,
});

export const CategoryUpdateSchema = z.object({
  name: categoryNameField.optional(),
});

export const CategoryQuerySchema = z
  .object({
    page: pageField.optional(),
    name: categoryNameField.optional(),
  })
  .strict();

export const CategorySchema = z.object({
  id: idField,
  name: categoryNameField,
});

export type CategoryType = z.infer<typeof CategorySchema>;
