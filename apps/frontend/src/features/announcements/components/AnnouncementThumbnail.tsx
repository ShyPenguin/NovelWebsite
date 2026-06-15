import { announcementsIdRoute, LOGO_URL } from "@/shared/constants";
import { formatTimeAgo } from "@/shared/utils/formatTimeAge";
import type { AnnouncementThumbnailDTO } from "@repo/contracts/dto/announcement";
import { Link } from "@tanstack/react-router";

export const AnnouncementThumbnail = ({
  id,
  title,
  createdAt,
}: AnnouncementThumbnailDTO) => {
  return (
    <Link
      to={announcementsIdRoute}
      params={{ id: id }}
      className="card dark:bg-primary-gray/5 flex w-full h-full py-2 px-2"
    >
      <div className="flex-center">
        <img src={LOGO_URL} className="logo-img mr-5" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm">{title}</p>
        <p className="line-clamp-2 text-xxs text-muted-foreground">
          {formatTimeAgo(createdAt.toISOString())}
        </p>
      </div>
    </Link>
  );
};
