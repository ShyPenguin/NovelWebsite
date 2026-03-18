import { CategoryBaseSchema } from "@/base/category.base.js";
import { GetFactory } from "../read-factory.js";

export const CategoryDetailFactory = new GetFactory({
  schema: CategoryBaseSchema,
});
