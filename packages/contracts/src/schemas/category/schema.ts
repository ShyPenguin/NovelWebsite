import { CategoryDetailFactory } from "@/factories/category/index.js";
import { z } from "zod";

//READ
export const CategoryDetailSchema = CategoryDetailFactory.getSchema();
export const ArrayCategoryDetailSchema = CategoryDetailFactory.array();
export const PaginatedCategoryDetailSchema = CategoryDetailFactory.paginate();

//WRITE
export const CategoryFormSchema = z.object({
  name: CategoryDetailSchema.shape["name"],
});

// export const CategoryQuerySchema = z
//   .object({
//     page: pageField.optional(),
//     name: categoryNameField.optional(),
//   })
//   .strict();
