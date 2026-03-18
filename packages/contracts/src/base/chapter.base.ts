import {
  chapterNumberField,
  chapterAccessField,
  chapterStatusField,
} from "@/fields/chapter.fields.js";
import {
  idField,
  titleField,
  createUrlField,
  createIdField,
} from "@/fields/general.js";
import {
  createYyyyMmDdStringToDate,
  createIsoStringToDateField,
} from "@/schemas/date/schema.js";
import { z } from "zod";

export const ChapterBaseSchema = z.object({
  id: idField,
  title: titleField,
  chapterNumber: chapterNumberField,
  publishedAt: createYyyyMmDdStringToDate("Published at").nullish(),
  createdAt: createIsoStringToDateField("createdAt"),
  updatedAt: createIsoStringToDateField("updatedAt"),
  access: chapterAccessField,
  status: chapterStatusField,
  sourceDocUrl: createUrlField("Source document url"),
  contentHtml: z.string({
    error: (iss) =>
      iss.input === undefined || iss.input === null || iss.input === ""
        ? "Content is required"
        : "Content must be a string",
  }),
  prevChapter: createIdField("prevChapter").nullish(),
  nextChapter: createIdField("nextChapter").nullish(),
});
