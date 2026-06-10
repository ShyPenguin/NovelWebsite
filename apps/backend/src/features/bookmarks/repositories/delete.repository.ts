import {
  BookmarksTable,
  BookmarksTableSelect,
} from "@/infrastructure/db/schemas/bookmarks.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { and, eq } from "drizzle-orm";

export const deleteBookmarkTx = async (
  {
    novelId,
    userId,
  }: {
    novelId: BookmarksTableSelect["novelId"];
    userId: BookmarksTableSelect["userId"];
  },
  tx: DbExecTypes,
): Promise<BookmarksTableSelect> => {
  const result = await tx
    .delete(BookmarksTable)
    .where(
      and(
        eq(BookmarksTable.novelId, novelId),
        eq(BookmarksTable.userId, userId),
      ),
    )
    .returning();

  return result[0];
};
