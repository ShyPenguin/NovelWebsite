import { getTableColumns } from "drizzle-orm/utils";
import { getNextChapter, getPrevChapter } from "@/shared/utils/subqueries.js";
import { ChapterTable, UserTable } from "@/infrastructure/db/schemas/index.js";
import {
  ChapterDetailDTO,
  ChapterAuthDTO,
  ChapterSelectDTO,
  ChapterThumbnailDTO,
} from "@repo/contracts/dto/chapter";

const chapterColumns = getTableColumns(ChapterTable);
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
    translator: {
      id: UserTable.id,
      name: UserTable.name,
    },
  } satisfies Record<keyof ChapterThumbnailDTO, unknown>,
  auth: {
    id: ChapterTable.id,
    novelId: ChapterTable.novelId,
    translator: {
      id: UserTable.id,
      name: UserTable.name,
    },
  } satisfies Record<keyof ChapterAuthDTO, unknown>,
} as const satisfies Record<ChapterSelectDTO, unknown>;
