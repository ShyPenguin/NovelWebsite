import { z } from "zod";
import {
  chapterNumberField,
  chapterAccessField,
  chapterStatusField,
} from "../fields/chapter.fields";
import {
  createIdField,
  createUrlField,
  idField,
  titleField,
} from "../fields/general";
import {
  createYyyyMmDdStringToDate,
  createIsoStringToDateField,
} from "../schemas/date/schema";

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
