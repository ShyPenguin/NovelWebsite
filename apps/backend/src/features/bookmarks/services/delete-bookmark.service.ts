import { getBookmarkAuthByIdTx } from "../repositories/get-bookmark-one.repository.js";
import { deleteBookmarkTx } from "../repositories/delete.repository.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { db } from "@/infrastructure/db/index.js";
import { BookmarksTableSelect } from "@/infrastructure/db/schemas/bookmarks.js";
import { NotFoundError } from "@/shared/errors/index.js";

export const deleteBookmarkService = async (
  {
    novelId,
  }: {
    novelId: BookmarksTableSelect["novelId"];
  },
  user: UserSession,
  tx: DbExecTypes = db,
) => {
  const result = await tx.transaction(async (trx) => {
    const bookmarkDetailed = await getBookmarkAuthByIdTx(
      { novelId, userId: user.id },
      trx,
    );

    if (!bookmarkDetailed) {
      throw new NotFoundError("bookmarks");
    }

    const result = await deleteBookmarkTx({ novelId, userId: user.id }, trx);

    return result!;
  });

  return result;
};
