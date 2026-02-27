import { eq, sql } from "drizzle-orm";
import {
  NovelDetailDTO,
  NovelAuthDTO,
  NovelSelectDTO,
  NovelThumbnailDTO,
  NovelTrendDTO,
} from "@repo/contracts/dto/novel";
import { AuthorTable } from "@/infrastructure/db/schemas/authors.ts";
import { ChapterTable } from "@/infrastructure/db/schemas/chapters.ts";
import {
  NovelTable,
  getNovelColumns,
  UserTable,
} from "@/infrastructure/db/schemas/index.ts";
import {
  getNovelCategories,
  getNovelSchedule,
} from "@/shared/utils/subqueries.ts";

export const getTotalChapter = sql<number>`
  (
    SELECT COUNT(DISTINCT ${ChapterTable.id})
    FROM ${ChapterTable}
    WHERE ${eq(ChapterTable.novelId, NovelTable.id)}
  )
`.as("totalChapters");

const { authorId, translatorId, ...novelColumns } = getNovelColumns();

export const novelSelectMap = {
  detail: {
    ...novelColumns,
    author: {
      id: AuthorTable.id,
      name: AuthorTable.name,
    },
    translator: {
      id: UserTable.id,
      name: UserTable.name,
    },
    categories: getNovelCategories,
    schedule: getNovelSchedule,
    totalChapters: getTotalChapter,
  } satisfies Record<keyof NovelDetailDTO, unknown>,
  thumbnail: {
    id: NovelTable.id,
    title: NovelTable.title,
    description: NovelTable.description,
    coverImageUrl: NovelTable.coverImageUrl,
    translator: {
      id: UserTable.id,
      name: UserTable.name,
    },
  } satisfies Record<keyof NovelThumbnailDTO, unknown>,
  trend: {
    id: NovelTable.id,
    title: NovelTable.title,
    coverImageUrl: NovelTable.coverImageUrl,
    totalChapters: getTotalChapter,
  } satisfies Record<keyof NovelTrendDTO, unknown>,
  auth: {
    id: NovelTable.id,
    translator: {
      id: UserTable.id,
      name: UserTable.name,
    },
  } satisfies Record<keyof NovelAuthDTO, unknown>,
} as const satisfies Record<NovelSelectDTO, unknown>;
