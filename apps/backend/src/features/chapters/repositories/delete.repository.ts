import { ChapterTable } from "@/infrastructure/db/schemas/chapters.js";
import { DeleteResourceFactory } from "@/shared/factories/repository/delete.repository.js";

export const deleteChapterTx = DeleteResourceFactory({
  table: ChapterTable,
  tableId: ChapterTable.id,
});
