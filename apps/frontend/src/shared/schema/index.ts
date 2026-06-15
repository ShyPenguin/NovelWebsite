import z from "zod";
import { searchField } from "@repo/contracts/fields/general";
import { DEFAULT_PAGE_SIZE } from "@repo/contracts/constants";
export const pageField = z.coerce.number().catch(1).default(1);
export const pageSizeField = z.coerce
  .number()
  .catch(DEFAULT_PAGE_SIZE)
  .default(DEFAULT_PAGE_SIZE);

export const searchFieldExtend = searchField.catch("").default("");

export const imageFileField = z
  .instanceof(File)
  .refine((f) => f.size <= 5 * 1024 * 1024, {
    message: "Max file size is 5MB",
  })
  .refine(
    (f) =>
      [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
        "image/jpg",
      ].includes(f.type),
    {
      message: "Invalid image format",
    },
  );
