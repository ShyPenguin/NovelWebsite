import { AnnouncementTable } from "@/infrastructure/db/schemas/announcements.js";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";

export const createAnnouncementTx = CreateResourceFactory<
  typeof AnnouncementTable
>({
  table: AnnouncementTable,
});
