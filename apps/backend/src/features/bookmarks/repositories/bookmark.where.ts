import {
  BookmarksTable,
  BookmarksTableSelect,
} from "@/infrastructure/db/schemas/bookmarks.js";
import { and, eq } from "drizzle-orm";

export const bookmarksWhereMap = {
  primary: ({
    novelId,
    userId,
  }: {
    novelId: BookmarksTableSelect["novelId"];
    userId: BookmarksTableSelect["userId"];
  }) =>
    and(eq(BookmarksTable.userId, userId), eq(BookmarksTable.novelId, novelId)),
};

export type BookmarkWhere = typeof bookmarksWhereMap;
