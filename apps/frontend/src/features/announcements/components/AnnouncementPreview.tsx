import { Preview } from "@/shared/components/MarkdownEditor";
import { formatTimeAgo } from "@/shared/utils/formatTimeAge";
import type { AnnouncementDetailDTO } from "@repo/contracts/dto/announcement";

export const AnnouncementPreview = ({
  announcement,
}: {
  announcement: Exclude<AnnouncementDetailDTO, "id">;
}) => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{announcement.title}</h1>

        <div className="mt-4 flex items-center gap-2">
          <span>{announcement.author.name}</span>
          <span className="status">{announcement.author.role}</span>
        </div>

        <p className="text-sm text-muted-foreground">
          {formatTimeAgo(announcement.createdAt.toISOString())}
        </p>
      </header>

      <Preview content={announcement.content} />
    </div>
  );
};
