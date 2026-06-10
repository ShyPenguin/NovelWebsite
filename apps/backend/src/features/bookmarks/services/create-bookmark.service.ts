import { db } from "@/infrastructure/db/index.js";
import { BookmarksTableInsert } from "@/infrastructure/db/schemas/bookmarks.js";
import { DbClientType, DbPoolType } from "@/infrastructure/db/type.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { BookmarkDetailDTO } from "@repo/contracts/dto/bookmark";
import { createBookmarkTx } from "../repositories/create.repository.js";
import { BaseError, NotFoundError } from "@/shared/errors/index.js";
import { getBookmarkDetailByIdTx } from "../repositories/get-bookmark-one.repository.js";

export const createBookmarkService = async ({
  form,
  user,
  tx = db,
}: {
  form: { novelId: BookmarksTableInsert["novelId"] };
  user: UserSession;
  tx?: DbPoolType | DbClientType;
}): Promise<BookmarkDetailDTO> => {
  try {
    const result = await tx.transaction(async (trx) => {
      const bookmark = await createBookmarkTx({
        tx: trx,
        form: {
          novelId: form.novelId,
          userId: user.id,
        },
      });

      const bookmarkDetail = await getBookmarkDetailByIdTx(
        { novelId: bookmark.novelId, userId: bookmark.userId },
        trx,
      );

      if (!bookmarkDetail) {
        throw new NotFoundError("bookmarks");
      }

      return bookmarkDetail;
    });

    return result;
  } catch (err: any) {
    if (
      (err.code === "23502" || err.code === "23503") &&
      err.message.includes("novel")
    ) {
      throw new NotFoundError("novels");
    }
    if (
      (err.code === "23502" || err.code === "23503") &&
      err.message.includes("user")
    ) {
      throw new NotFoundError("users");
    }
    if (err.code === "23502") {
      throw new NotFoundError("bookmarks");
    }

    throw new BaseError(500, "Internal Server Error");
  }
};
