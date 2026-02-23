import { sql } from "drizzle-orm";
import {
  CategoryTable,
  ChapterTable,
  NovelCategoryTable,
  NovelScheduleTable,
  NovelTable,
} from "../db/schemas/index.ts";
import { alias } from "drizzle-orm/pg-core";
import { chapterAlias } from "./databaseAlises.ts";
import { WeekDay } from "../services/novelSchedule/index.ts";

export const getNovelCategories = sql<{ id: string; name: string }[]>`
(
  SELECT COALESCE(
    json_agg(
      jsonb_build_object(
        'id', ${CategoryTable.id},
        'name', ${CategoryTable.name}
      )
    ),
    '[]'::json
  )
  FROM ${NovelCategoryTable}
  JOIN ${CategoryTable}
    ON ${NovelCategoryTable.categoryId} = ${CategoryTable.id}
  WHERE ${NovelCategoryTable.novelId} = ${NovelTable.id}
)
`.as("categories");

export const getNovelSchedule = sql<WeekDay[]>`(
  SELECT COALESCE(
    json_agg(
        ${NovelScheduleTable.day}
    ),
    '[]'::json
  )
  FROM ${NovelScheduleTable}
  WHERE ${NovelScheduleTable.novelId} = ${NovelTable.id}
)`.as("schedules");

export const next = alias(ChapterTable, "n");
export const prev = alias(ChapterTable, "p");

export const getNextChapter = sql<string | null>`(
  SELECT ${ChapterTable.id}
  FROM ${ChapterTable}
  WHERE ${ChapterTable.novelId} = ${chapterAlias.novelId}
    AND ${ChapterTable.chapterNumber} > ${chapterAlias.chapterNumber}
  ORDER BY ${ChapterTable.chapterNumber} ASC
  LIMIT 1
)`.as("nextChapter");

export const getPrevChapter = sql<string | null>`(
  SELECT ${ChapterTable.id}
  FROM ${ChapterTable}
  WHERE ${ChapterTable.novelId} = ${chapterAlias.novelId}
    AND ${ChapterTable.chapterNumber} < ${chapterAlias.chapterNumber}
  ORDER BY ${ChapterTable.chapterNumber} DESC
  LIMIT 1
)`.as("prevChapter");
