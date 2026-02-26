import { getTableColumns } from "drizzle-orm/utils";
import { chapterAlias } from "@/shared/utils/databaseAlises.ts";
import { getNextChapter, getPrevChapter } from "@/shared/utils/subqueries.ts";
import { ChapterTable, UserTable } from "@/infrastructure/db/schemas/index.ts";
import {
  ChapterDetailDTO,
  ChapterPosterDTO,
  ChapterSelectDTO,
  ChapterThumbnailDTO,
} from "@repo/contracts/dto/chapter";

const chapterColumns = getTableColumns(chapterAlias);
export const chapterSelectMap = {
  detail: {
    ...chapterColumns,
    translator: {
      id: UserTable.id,
      name: UserTable.name,
    },
    prevChapter: getPrevChapter,
    nextChapter: getNextChapter,
  } satisfies Record<keyof ChapterDetailDTO, unknown>,
  thumbnail: {
    id: ChapterTable.id,
    title: ChapterTable.title,
    chapterNumber: ChapterTable.chapterNumber,
    updatedAt: ChapterTable.updatedAt,
    publishedAt: ChapterTable.publishedAt,
    access: ChapterTable.access,
    status: ChapterTable.status,
  } satisfies Record<keyof ChapterThumbnailDTO, unknown>,
  poster: {
    id: ChapterTable.id,
    chapterNumber: ChapterTable.chapterNumber,
    novelId: ChapterTable.novelId,
    translator: {
      id: UserTable.id,
      name: UserTable.name,
    },
  } satisfies Record<keyof ChapterPosterDTO, unknown>,
} as const satisfies Record<ChapterSelectDTO, unknown>;
