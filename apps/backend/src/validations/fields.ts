import { z } from "zod";
import { weekDay } from "../db/schemas/index.ts";

export const docUrlField = z
  .string({
    required_error: "docUrl is required",
    invalid_type_error: "docUrl must be a string",
  })
  .url("Invalid URL format");

export const chapterNumberField = z.number({
  invalid_type_error: "Chapter Number must be a number",
});

export const authorNameField = z
  .string({
    required_error: "Author's name is required",
    invalid_type_error: "Author's name must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for Author's name" })
  .max(50, { message: "50 Letters Maximum for Author's name" });

export const categoryNameField = z
  .string({
    required_error: "Category's name is required",
    invalid_type_error: "Category's name must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for Category's name" })
  .max(50, { message: "50 Letters Maximum for Category's name" });

export const titleField = z
  .string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for title" })
  .max(255, { message: "255 Letters Maximum for title" });

export const authorIdField = z
  .string({ required_error: "Author is required" })
  .uuid({
    message: "Author is not in correct format",
  });

export const translatorIdField = z
  .string({ required_error: "Translator is required" })
  .uuid({
    message: "Translator is not in correct format",
  });

export const descriptionField = z
  .string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for Description" })
  .max(1000, { message: "1000 Letters Maximum for Description" });

export const ratingField = z
  .number({ invalid_type_error: "Rating must be a number" })
  .min(1, { message: "Rating must be a minimum of 1" })
  .max(5, { message: "Rating must be a maximum of 5" })
  .default(5.0);

export const idField = z.string().uuid({
  message: "ID is not in correct format",
});

export const pageField = z.coerce
  .number({
    invalid_type_error: "Page must be a number",
  })
  .optional();

export const idSchema = z.object({
  id: idField,
});

export const releaseDateField = z
  .string()
  .datetime(`Release Date must be a valid date type`)
  .optional();

export const contentField = z
  .string({
    required_error: "Content is required",
    invalid_type_error: "Content must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for content" })
  .max(20_000, { message: "20,000 Letters Maximum for content" });

export const reviewField = z
  .string({
    required_error: "Review is required",
    invalid_type_error: "Review must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for review" })
  .max(10_000, { message: "10,000 Letters Maximum for review" });

export const commentField = z
  .string({
    required_error: "Comment is required",
    invalid_type_error: "Comment must be a string",
  })
  .trim()
  .min(1, { message: "1 Letter Minimum for comment" })
  .max(1_000, { message: "1,000 Letters Maximum for comment" });

export const weekDayField = z.enum(weekDay, {
  message: "day must be: SUN, MON, TUE, WED, THU, FRI, or SAT",
});
