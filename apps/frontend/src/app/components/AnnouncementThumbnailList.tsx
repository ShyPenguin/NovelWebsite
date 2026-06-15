import Paper from "@/assets/icons/Paper";
import { AnnouncementThumbnail } from "../../features/announcements/components/AnnouncementThumbnail";
import type { AnnouncementThumbnailDTO } from "@repo/contracts/dto/announcement";
import { Link } from "@tanstack/react-router";
import { ANNOUNCEMENT_SEARCH_DEFAULT } from "@/features/announcements/announcement.schema";

export const AnnouncementThumbnailList = ({
  announcements,
}: {
  announcements: Array<AnnouncementThumbnailDTO>;
}) => {
  return (
    <div className="flex flex-col gap-2 size-full lg:pr-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span>
            <Paper className="w-7 h-7" />
          </span>
          <h1>Announcements</h1>
        </div>
        <Link
          className="text-sm text-shadow-muted-foreground underline cursor-pointer"
          to={"/announcements"}
          search={ANNOUNCEMENT_SEARCH_DEFAULT}
        >
          View All
        </Link>
      </div>
      <h5>The latest news on our website.</h5>
      {announcements.map((announcement) => (
        <AnnouncementThumbnail {...announcement} key={announcement.id} />
      ))}
    </div>
  );
};
