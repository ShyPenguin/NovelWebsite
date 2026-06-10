import { BookmarksTable } from "@/infrastructure/db/schemas/bookmarks.js";
import { NovelTable } from "@/infrastructure/db/schemas/novels.js";
import { UserTable } from "@/infrastructure/db/schemas/users.js";
import {
  BookmarkAuthDTO,
  BookmarkDetailDTO,
  BookmarkSelectDTO,
} from "@repo/contracts/dto/bookmark";
import { getTableColumns } from "drizzle-orm";

const bookmarksColumns = getTableColumns(BookmarksTable);
export const bookmarkSelectMap = {
  detail: {
    novel: {
      id: NovelTable.id,
      title: NovelTable.title,
      slug: NovelTable.slug,
      description: NovelTable.description,
      coverImageUrl: NovelTable.coverImageUrl,
    },
    translator: {
      id: UserTable.id,
      name: UserTable.name,
    },
    userId: BookmarksTable.userId,
  } satisfies Record<keyof BookmarkDetailDTO, unknown>,
  auth: {
    ...bookmarksColumns,
  } satisfies Record<keyof BookmarkAuthDTO, unknown>,
} as const satisfies Record<BookmarkSelectDTO, unknown>;
