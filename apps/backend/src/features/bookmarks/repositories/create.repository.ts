import { BookmarksTable } from "@/infrastructure/db/schemas/bookmarks.js";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";

export const createBookmarkTx = CreateResourceFactory<typeof BookmarksTable>({
  table: BookmarksTable,
});
