import { ChapterTable } from "@/infrastructure/db/schemas/chapters.ts";
import { UpdateResourceFactory } from "@/shared/factories/repository/update.repository.ts";

export const updateChapterTx = UpdateResourceFactory({
  table: ChapterTable,
  tableId: ChapterTable.id,
});
