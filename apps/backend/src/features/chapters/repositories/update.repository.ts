import { ChapterTable } from "@/infrastructure/db/schemas/chapters.js";
import { UpdateResourceFactory } from "@/shared/factories/repository/update.repository.js";

export const updateChapterTx = UpdateResourceFactory({
  table: ChapterTable,
  tableId: ChapterTable.id,
});
