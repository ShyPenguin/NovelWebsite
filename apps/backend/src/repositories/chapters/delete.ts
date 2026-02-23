import { ChapterTable } from "../../db/schemas/index.ts";
import { DeleteResourceFactory } from "../factories/delete.ts";

export const deleteChapterTx = DeleteResourceFactory({
  table: ChapterTable,
  tableId: ChapterTable.id,
});
