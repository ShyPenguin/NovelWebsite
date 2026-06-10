import { BookmarksTable } from "@/infrastructure/db/schemas/bookmarks.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { BookmarkSelectDTO } from "@repo/contracts/dto/bookmark";
import { eq, sql } from "drizzle-orm";
import { bookmarkSelectMap } from "./bookmark.selections.js";
import { NovelTable } from "@/infrastructure/db/schemas/novels.js";
import { UserTable } from "@/infrastructure/db/schemas/users.js";

export const buildBookmarksBaseQuery = ({
  type,
  tx,
}: {
  type: BookmarkSelectDTO;
  tx: DbExecTypes;
}) => {
  const select = bookmarkSelectMap[type];

  switch (type) {
    case "detail": {
      return tx
        .select(select)
        .from(BookmarksTable)
        .leftJoin(NovelTable, eq(NovelTable.id, BookmarksTable.novelId))
        .leftJoin(UserTable, eq(NovelTable.translatorId, UserTable.id));
    }
    case "auth": {
      return tx.select(select).from(BookmarksTable);
    }
  }
};

export const buildBookmarkCountQuery = ({ tx }: { tx: DbExecTypes }) => {
  return tx
    .select({
      count: sql<number>`count(*)`,
    })
    .from(BookmarksTable);
};
