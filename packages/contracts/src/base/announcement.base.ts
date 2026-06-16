import { StringSchemaBuilder } from "@/fields/builders/StringSchema.js";
import { idField, titleField } from "@/fields/general.js";
import { createIsoStringToDateField } from "@/schemas/date/schema.js";
import { z } from "zod";

export const AnnouncementBaseSchema = z.object({
  id: idField,
  title: titleField,
  content: new StringSchemaBuilder("Content").min(1).build(),
  createdAt: createIsoStringToDateField("createdAt"),
  updatedAt: createIsoStringToDateField("updatedAt"),
});
