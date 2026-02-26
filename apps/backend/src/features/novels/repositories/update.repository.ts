import { NovelTable } from "@/infrastructure/db/schemas/novels.ts";
import { UpdateResourceFactory } from "@/shared/factories/repository/update.repository.ts";

export const updateNovelTx = UpdateResourceFactory({
  table: NovelTable,
  tableId: NovelTable.id,
});
