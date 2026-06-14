import { AnnouncementTable } from "@/infrastructure/db/schemas/announcements.js";
import { UpdateResourceFactory } from "@/shared/factories/repository/update.repository.js";

export const updateAnnouncementTx = UpdateResourceFactory({
  table: AnnouncementTable,
  tableId: AnnouncementTable.id,
});
