import { NovelTable } from "@/infrastructure/db/schemas/novels.ts";
import { DeleteResourceFactory } from "@/shared/factories/repository/delete.repository.ts";

export const deleteNovelTx = DeleteResourceFactory({
  table: NovelTable,
  tableId: NovelTable.id,
});
