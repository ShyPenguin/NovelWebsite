import { eq, sql } from "drizzle-orm";
import {
  NovelDetailDTO,
  NovelAuthDTO,
  NovelSelectDTO,
  NovelThumbnailDTO,
  NovelTrendDTO,
} from "@repo/contracts/dto/novel";
import { AuthorTable } from "@/infrastructure/db/schemas/authors.js";
import { ChapterTable } from "@/infrastructure/db/schemas/chapters.js";
import {
  NovelTable,
  getNovelColumns,
  UserTable,
  BookmarksTable,
} from "@/infrastructure/db/schemas/index.js";
import {
  getNovelCategories,
  getNovelSchedule,
} from "@/shared/utils/subqueries.js";

export const getTotalChapter = sql<number>`
  (
    SELECT COUNT(DISTINCT ${ChapterTable.id})
    FROM ${ChapterTable}
    WHERE ${eq(ChapterTable.novelId, NovelTable.id)}
  )
`.as("totalChapters");

export const getBookmarkCount = sql<number>`
  (
    SELECT COUNT(*)
    FROM ${BookmarksTable}
    WHERE ${eq(BookmarksTable.novelId, NovelTable.id)}
  )
`.as("bookmarkCount");

export const getIsBookmarked = (userId: string) =>
  sql<boolean>`
    EXISTS (
      SELECT 1
      FROM ${BookmarksTable}
      WHERE ${BookmarksTable.novelId} = ${NovelTable.id}
      AND ${BookmarksTable.userId} = ${userId}
    )
  `.as("isBookmarked");

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
    bookmarkCount: getBookmarkCount,
  } satisfies Record<Exclude<keyof NovelDetailDTO, "isBookmarked">, unknown>,
  thumbnail: {
    id: NovelTable.id,
    title: NovelTable.title,
    slug: NovelTable.slug,
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
    slug: NovelTable.slug,
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
