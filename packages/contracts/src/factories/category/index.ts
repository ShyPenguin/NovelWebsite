import { z } from "zod";
import { idField } from "../../schemas/fields";
import { GetFactory } from "../read-factory";

const categoryNameField = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Category's name is required"
        : "Category's name must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for Category's name" })
  .max(50, { message: "50 Letters Maximum for Category's name" });

//READ
const CategoryDetailSchema = z.object({
  id: idField,
  name: categoryNameField,
});

export const CategoryDetailFactory = new GetFactory({
  schema: CategoryDetailSchema,
});
