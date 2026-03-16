import { NovelTable } from "@/infrastructure/db/schemas/novels.js";
import { UpdateResourceFactory } from "@/shared/factories/repository/update.repository.js";

export const updateNovelTx = UpdateResourceFactory({
  table: NovelTable,
  tableId: NovelTable.id,
});
