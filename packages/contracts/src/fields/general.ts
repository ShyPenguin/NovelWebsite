import { z } from "zod";
import { StringSchemaBuilder } from "./builders/StringSchema";

export const idField = z.uuid({
  error: (iss) =>
    iss.input === undefined ? "ID is required" : "ID is not in correct format",
});

export const emailField = z.email({
  error: (iss) =>
    iss.input === undefined || iss.input === null || iss.input === ""
      ? "Email is required"
      : "Email is invalid",
});
export const createIdField = (fieldName: string) =>
  z.uuid({
    error: (iss) =>
      iss.input === undefined || iss.input === null || iss.input === ""
        ? `${fieldName}'s ID is required`
        : `${fieldName}'s ID is not in correct format`,
  });

export const urlField = z.url("Invalid URL");

export const createUrlField = (fieldName: string = "url") =>
  z.url({
    error: (iss) =>
      iss.input === undefined || iss.input === null || iss.input === ""
        ? `${fieldName} is required`
        : `${fieldName} is invalid URL`,
  });

export const titleField = new StringSchemaBuilder("Title")
  .min(1)
  .max(255)
  .build();

export const descriptionField = new StringSchemaBuilder("Description")
  .min(1)
  .max(1000)
  .build();

export const createDateField = (fieldName: string = "Date") =>
  z
    .string({
      error: (iss) =>
        iss.input === undefined || iss.input === null || iss.input === ""
          ? `${fieldName} is required`
          : `${fieldName} must be in YYYY-MM-DD string format`,
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: `${fieldName} must be in YYYY-MM-DD string format`,
    });

export const dateField = z
  .string({
    error: (iss) =>
      iss.input === undefined || iss.input === null || iss.input === ""
        ? "Date is required"
        : "Date must be a string",
  })
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
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
