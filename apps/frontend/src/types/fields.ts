import { z } from "zod";

export const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export const idField = z.uuid();

export const titleField = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "Title is required" : "Title must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for title" })
  .max(255, { message: "255 Letters Maximum for title" });

export const descriptionField = z
  .string({
    error: (iss) => {
      if (iss.input === undefined) {
        return { message: "Description" };
      }
      if (iss.code === "invalid_type") {
        return { message: "Description must be a string" };
      }
    },
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for Description" })
  .max(1000, { message: "1000 Letters Maximum for Description" });

export const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Date must be in YYYY-MM-DD format",
});

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

export const weekDayField = z.enum(week, {
  message: "day must be: SUN, MON, TUE, WED, THU, FRI, or SAT",
});
