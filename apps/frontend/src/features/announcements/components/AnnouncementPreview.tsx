import Pencil from "@/assets/icons/Pencil";
import { Can } from "@/features/auth/components/Can";
import { Preview } from "@/shared/components/MarkdownEditor";
import { announcementsIdEditRoute } from "@/shared/constants";
import { formatTimeAgo } from "@/shared/utils/formatTimeAge";
import type { AnnouncementDetailDTO } from "@repo/contracts/dto/announcement";
import { Link } from "@tanstack/react-router";
import { AnnouncementDeleteButton } from "./form/AnnouncementDeleteButton";

type AnnouncementPreviewProp = {
  withId?: boolean;
} & (
  | {
      withId?: false;
      announcement: Omit<AnnouncementDetailDTO, "id">;
    }
  | {
      withId?: true;
      announcement: AnnouncementDetailDTO;
    }
);

export const AnnouncementPreview = ({
  withId = false,
  announcement,
}: AnnouncementPreviewProp) => {
  return (
    <div className="space-y-6">
      <header>
        <div className="relative">
          <h1 className="text-3xl font-bold">{announcement.title}</h1>
          {withId && "id" in announcement && (
            <>
              <Can resource="announcements" action="update" ctx={{}}>
                <div className="absolute top-0 right-12">
                  <Link
                    to={announcementsIdEditRoute}
                    params={{ id: announcement.id }}
                    className="dark:text-black hover:text-green-500 cursor-pointer 
          dark:bg-white rounded-full bg-primary-black flex p-2"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                </div>
              </Can>

              <Can
                resource="authors"
                action="delete"
                ctx={{ data: { id: announcement!.id } }}
              >
                <div className="absolute top-0 right-0">
                  <AnnouncementDeleteButton announcement={announcement!} />
                </div>
              </Can>
            </>
          )}
        </div>

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
