import { AnnouncementTable } from "@/infrastructure/db/schemas/announcements.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { announcementSelectMap } from "@/features/announcements/repositories/announcement.selections.js";
import { AnnouncementSelectDTO } from "@repo/contracts/dto/announcement";
import { eq, sql } from "drizzle-orm";
import { UserTable } from "@/infrastructure/db/schemas/users.js";

export const buildAnnouncementsBaseQuery = ({
  type,
  tx,
}: {
  type: AnnouncementSelectDTO;
  tx: DbExecTypes;
}) => {
  const select = announcementSelectMap[type];

  switch (type) {
    case "detail":
    case "auth": {
      return tx
        .select(select)
        .from(AnnouncementTable)
        .leftJoin(UserTable, eq(UserTable.id, AnnouncementTable.authorId));
    }
    case "thumbnail": {
      return tx.select(select).from(AnnouncementTable);
    }
  }
};

export const buildAnnouncementCountQuery = ({ tx }: { tx: DbExecTypes }) => {
  return tx
    .select({
      count: sql<number>`count(distinct ${AnnouncementTable.id})`,
    })
    .from(AnnouncementTable);
};

export type AnnouncementBaseQuery = ReturnType<
  typeof buildAnnouncementsBaseQuery | typeof buildAnnouncementCountQuery
>;
