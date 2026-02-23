import { z } from "zod";
import { pageField, commentField } from "./fields.ts";

export const CommentFormSchema = z.object({
  comment: commentField,
});
export const CommentQuerySchema = z
  .object({
    comment: commentField.optional(),
    page: pageField.optional(),
  })
  .strict();
