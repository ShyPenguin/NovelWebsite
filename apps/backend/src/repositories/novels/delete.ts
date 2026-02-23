import { NovelTable } from "../../db/schemas/index.ts";
import { DeleteResourceFactory } from "../factories/delete.ts";

export const deleteNovelTx = DeleteResourceFactory({
  table: NovelTable,
  tableId: NovelTable.id,
});
