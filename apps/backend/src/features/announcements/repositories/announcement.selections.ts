import { AnnouncementTable } from "@/infrastructure/db/schemas/announcements.js";
import { UserTable } from "@/infrastructure/db/schemas/users.js";
import {
  AnnouncementAuthDTO,
  AnnouncementDetailDTO,
  AnnouncementSelectDTO,
  AnnouncementThumbnailDTO,
} from "@repo/contracts/dto/announcement";
import { getTableColumns } from "drizzle-orm";

const columns = getTableColumns(AnnouncementTable);
export const announcementSelectMap = {
  detail: {
    id: AnnouncementTable.id,
    title: AnnouncementTable.title,
    content: AnnouncementTable.content,
    createdAt: AnnouncementTable.createdAt,
    updatedAt: AnnouncementTable.updatedAt,
    author: {
      id: UserTable.id,
      name: UserTable.name,
    },
  } satisfies Record<keyof AnnouncementDetailDTO, unknown>,
  thumbnail: {
    id: AnnouncementTable.id,
    title: AnnouncementTable.title,
    createdAt: AnnouncementTable.createdAt,
    updatedAt: AnnouncementTable.updatedAt,
  } satisfies Record<keyof AnnouncementThumbnailDTO, unknown>,
  auth: {
    id: AnnouncementTable.id,
    author: {
      id: UserTable.id,
      name: UserTable.name,
    },
  } satisfies Record<keyof AnnouncementAuthDTO, unknown>,
} as const satisfies Record<AnnouncementSelectDTO, unknown>;
