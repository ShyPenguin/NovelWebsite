import { CategoryBaseSchema } from "../../base/category.base";
import { GetFactory } from "../read-factory";

export const CategoryDetailFactory = new GetFactory({
  schema: CategoryBaseSchema,
});
