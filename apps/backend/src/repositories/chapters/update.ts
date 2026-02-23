import { ChapterTable } from "../../db/schemas/index.ts";
import { UpdateResourceFactory } from "../factories/update.ts";

export const updateChapterTx = UpdateResourceFactory({
  table: ChapterTable,
  tableId: ChapterTable.id,
});
