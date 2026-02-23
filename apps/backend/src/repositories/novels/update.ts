import { NovelTable } from "../../db/schemas/index.ts";
import { UpdateResourceFactory } from "../factories/update.ts";

export const updateNovelTx = UpdateResourceFactory({
  table: NovelTable,
  tableId: NovelTable.id,
});
