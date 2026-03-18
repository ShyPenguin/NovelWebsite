import {
  createIdField,
  titleField,
  descriptionField,
  urlField,
} from "@/fields/general.js";
import {
  createStringNumberToNumber,
  novelTypeField,
  languageField,
  novelStatusField,
  weekDayField,
} from "@/fields/novel.fields.js";
import {
  isoStringToDate,
  createIsoStringToDateField,
} from "@/schemas/date/schema.js";
import { z } from "zod";

export const NovelBaseSchema = z.object({
  id: createIdField("Novel"),
  title: titleField,
  description: descriptionField,
  coverImageUrl: urlField.nullish(),
  coverImagePath: z.string().nullish(),
  totalChapters: createStringNumberToNumber("Total chapters"),
  release: isoStringToDate,
  createdAt: createIsoStringToDateField("createdAt"),
  updatedAt: createIsoStringToDateField("updatedAt"),
  type: novelTypeField,
  language: languageField,
  status: novelStatusField,
  schedule: weekDayField.array(),
});
