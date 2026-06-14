import { AnnouncementTable } from "@/infrastructure/db/schemas/announcements.js";
import { DeleteResourceFactory } from "@/shared/factories/repository/delete.repository.js";

export const deleteAnnouncementTx = DeleteResourceFactory({
  table: AnnouncementTable,
  tableId: AnnouncementTable.id,
});
