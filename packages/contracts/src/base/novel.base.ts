import {
  novelTypeField,
  languageField,
  novelStatusField,
  weekDayField,
  createStringNumberToNumber,
} from "../fields/novel.fields";
import {
  createIdField,
  titleField,
  descriptionField,
  urlField,
} from "../fields/general";
import {
  createIsoStringToDateField,
  isoStringToDate,
} from "../schemas/date/schema";
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
