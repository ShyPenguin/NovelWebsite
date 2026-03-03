import {
  novelTypeField,
  languageField,
  novelStatusField,
  weekDayField,
  createStringNumberToNumber,
} from "../factories/novel/fields";
import {
  createIdField,
  titleField,
  descriptionField,
  urlField,
} from "../fields/fields";
import { isoStringToDate } from "../schemas/date/schema";
import { z } from "zod";

export const NovelBaseSchema = z.object({
  id: createIdField("Novel"),
  title: titleField,
  description: descriptionField,
  coverImageUrl: urlField.nullish(),
  coverImagePath: z.string().nullish(),
  totalChapters: createStringNumberToNumber("Total chapters"),
  release: isoStringToDate,
  type: novelTypeField,
  language: languageField,
  status: novelStatusField,
  schedule: weekDayField.array(),
});
