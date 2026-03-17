import { sql } from "drizzle-orm";
import { CategoryTable } from "@/infrastructure/db/schemas/categories.js";
import { ChapterTable } from "@/infrastructure/db/schemas/chapters.js";
import { NovelCategoryTable } from "@/infrastructure/db/schemas/novel-categories.js";
import { NovelTable } from "@/infrastructure/db/schemas/novels.js";
import {
  Week,
  NovelScheduleTable,
} from "@/infrastructure/db/schemas/novel-schedule.js";

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

export const getNovelSchedule = sql<Week[]>`(
  SELECT COALESCE(
    json_agg(
        ${NovelScheduleTable.day}
    ),
    '[]'::json
  )
  FROM ${NovelScheduleTable}
  WHERE ${NovelScheduleTable.novelId} = ${NovelTable.id}
)`.as("schedules");

export const getNextChapter = sql<string | null>`(
  SELECT n.id
  FROM chapters n
  WHERE n."novelId" = ${ChapterTable.novelId}
    AND n."chapterNumber" > ${ChapterTable.chapterNumber}
  ORDER BY n."chapterNumber" ASC
  LIMIT 1
)`.as("nextChapter");

export const getPrevChapter = sql<string | null>`(
  SELECT n.id
  FROM chapters n
  WHERE n."novelId" = ${ChapterTable.novelId}
    AND n."chapterNumber" < ${ChapterTable.chapterNumber}
  ORDER BY n."chapterNumber" DESC
  LIMIT 1
)`.as("prevChapter");
