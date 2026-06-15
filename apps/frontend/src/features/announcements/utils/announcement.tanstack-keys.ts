import type { AnnouncementDetailDTO } from "@repo/contracts/dto/announcement";

export const getAnnouncementOneQueryKey = ({
  id,
}: {
  id: AnnouncementDetailDTO["id"];
}) => ["announcement", id];
export const getAnnouncementsQueryKey = ["announcements"];

export const getAnnouncementCreateKey = ["announcements", "create"];

export const getAnnouncementUpdateKey = ({
  id,
}: {
  id: AnnouncementDetailDTO["id"];
}) => ["announcement", id, "update"];
