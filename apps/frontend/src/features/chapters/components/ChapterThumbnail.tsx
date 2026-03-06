import { Link, useNavigate } from "@tanstack/react-router";
import type { ChapterThumbnailDTO } from "@repo/contracts/dto/chapter";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import Pencil from "@/assets/icons/Pencil";
import { Can } from "@/features/auth/components/Can";
import { DeleteChapterButton } from "@/features/chapters/components/DeleteChapterButton";
import { formatTimeAgo } from "@/shared/utils";

export const ChapterThumbnail = ({
  id,
  title,
  chapterNumber,
  updatedAt,
  novelId,
  translator,
}: Pick<
  ChapterThumbnailDTO,
  "id" | "title" | "chapterNumber" | "updatedAt" | "translator"
> & {
  novelId: NovelDetailDTO["id"];
}) => {
  const navigate = useNavigate();
  return (
    <li
      className="flex justify-between items-center bg-secondary dark:bg-secondary-black p-4 card cursor-pointer"
      onClick={() =>
        navigate({
          to: "/novels/$novelId/chapters/$chapterId",
          params: { novelId, chapterId: id },
        })
      }
    >
      <div className="flex flex-col">
        <div className="text-[14px]">Chapter {chapterNumber}</div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground/90">{title}</span>
          <span className="text-xxs text-muted-foreground/80">
            {formatTimeAgo(updatedAt.toISOString())}
          </span>
        </div>
      </div>

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Can
          resource="chapters"
          action={"update"}
          ctx={{
            data: {
              id,
              novelId,
              translator,
            },
          }}
        >
          <Link
            to="/novels/$novelId/chapters/$chapterId/edit"
            params={{ novelId: novelId, chapterId: id }}
            className="dark:text-white bg:text-secondary-black hover:text-novelGreen cursor-pointer rounded-full p-2 bg-primary-black/5 dark:bg-primary-black/15"
          >
            <Pencil className="w-5 h-5" />
          </Link>
        </Can>
        <Can
          resource="chapters"
          action={"delete"}
          ctx={{
            data: {
              id,
              novelId,
              translator,
            },
          }}
        >
          <DeleteChapterButton
            id={id}
            title={title}
            chapterNumber={chapterNumber}
            novelId={novelId}
          />
        </Can>
      </div>
    </li>
  );
};
