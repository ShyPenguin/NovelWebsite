import { idField, titleField } from "@/fields/general.js";
import { createIsoStringToDateField } from "@/schemas/date/schema.js";
import { z } from "zod";

export const AnnouncementBaseSchema = z.object({
  id: idField,
  title: titleField,
  content: z.string({
    error: (iss) =>
      iss.input === undefined || iss.input === null || iss.input === ""
        ? "Content is required"
        : "Content must be a string",
  }),
  createdAt: createIsoStringToDateField("createdAt"),
  updatedAt: createIsoStringToDateField("updatedAt"),
});
