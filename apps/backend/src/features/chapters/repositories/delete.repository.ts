import { ChapterTable } from "@/infrastructure/db/schemas/chapters.ts";
import { DeleteResourceFactory } from "@/shared/factories/repository/delete.repository.ts";

export const deleteChapterTx = DeleteResourceFactory({
  table: ChapterTable,
  tableId: ChapterTable.id,
});
