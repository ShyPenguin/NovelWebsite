import { z } from "zod";
import { idField } from "../fields/general";

const categoryNameField = z
  .string({
    error: (iss) =>
      iss.input === undefined || iss.input === null || iss.input === ""
        ? "Category's name is required"
        : "Category's name must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for Category's name" })
  .max(50, { message: "50 Letters Maximum for Category's name" });

//READ
export const CategoryBaseSchema = z.object({
  id: idField,
  name: categoryNameField,
});
