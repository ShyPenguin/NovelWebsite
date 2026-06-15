import type { FullResponseMap } from "@/shared/types/responseTypes";
import type {
  AnnouncementDetailDTO,
  AnnouncementThumbnailDTO,
} from "@repo/contracts/dto/announcement";

export type AnnouncementResponseMap = {
  thumbnail: AnnouncementThumbnailDTO[];
  detail: AnnouncementDetailDTO[];
};

export type FetchAnnouncementsReturn<
  T extends keyof FullResponseMap<AnnouncementResponseMap>,
> = FullResponseMap<AnnouncementResponseMap>[T];
