import { NovelTable } from "@/infrastructure/db/schemas/novels.js";
import { DeleteResourceFactory } from "@/shared/factories/repository/delete.repository.js";

export const deleteNovelTx = DeleteResourceFactory({
  table: NovelTable,
  tableId: NovelTable.id,
});
