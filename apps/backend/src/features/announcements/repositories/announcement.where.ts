import { AnnouncementTable } from "@/infrastructure/db/schemas/announcements.js";
import { eq } from "drizzle-orm";

export const announcementWhereMap = {
  id: ({ id }: { id: string }) => eq(AnnouncementTable.id, id),
};

export type AnnouncementWhere = typeof announcementWhereMap;
