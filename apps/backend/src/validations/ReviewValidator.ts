import { z } from "zod";
import { pageField, ratingField, reviewField } from "./fields.ts";

export const ReviewFormSchema = z.object({
  rating: ratingField,
  review: reviewField,
});

export const ReviewQuerySchema = z
  .object({
    page: pageField.optional(),
  })
  .strict();

export const ReviewUpdateFormSchema = z.object({
  rating: ratingField.optional(),
  review: reviewField.optional(),
});
