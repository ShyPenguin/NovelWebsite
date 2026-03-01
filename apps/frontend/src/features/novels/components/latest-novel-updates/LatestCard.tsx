import { Link } from "@tanstack/react-router";
import { NO_IMAGE_URL } from "@/shared/constants";
import Clock from "@/assets/icons/Clock";
import FaBook from "@/assets/icons/FaBook";
import { Paid } from "@/shared/components/Paid";
import { formatTimeAgo } from "@/shared/utils";
import type { NovelLatestChapterDTO } from "@repo/contracts/dto/novelLatestChapter";

export const LatestCard = ({
  paid,
  id,
  novel,
  chapterNumber,
  title,
  updatedAt,
}: Pick<
  NovelLatestChapterDTO,
  "id" | "novel" | "chapterNumber" | "title" | "updatedAt"
> & { paid: boolean }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* IMAGE */}
      <Link
        to="/novels/$novelId/chapters"
        params={{ novelId: novel.id }}
        search={{ page: 1, sort: "desc", search: "" }}
        draggable={false}
        className="flex flex-col relative gap-2"
      >
        {paid && <Paid />}

        <img
          src={novel.coverImageUrl ?? NO_IMAGE_URL}
          className="aspect-72/97 size-full object-cover rounded-2xl"
          draggable={false}
        />
      </Link>

      {/* Details */}
      <Link
        to="/novels/$novelId/chapters/$chapterId"
        params={{ novelId: novel.id, chapterId: id }}
      >
        <div className="flex flex-col gap-[2px] space-y-0 items-start">
          <h5 className="font-semibold text-black dark:text-white m-0 p-0 leading-4">
            {"Chapter " + chapterNumber}
          </h5>
          <div className="flex size-full gap-1 items-center text-primary-gray">
            <div className="h-full">
              <FaBook className="w-3 h-3" />
            </div>

            <p className="text-xxs line-clamp-1 text-left leading-4">{title}</p>
          </div>
          <div className="flex items-center gap-1 text-primary-gray/50">
            <div className="h-full">
              <Clock className="w-3 h-3" />
            </div>
            <div className="text-xxs line-clamp-1 text-left leading-4">
              {formatTimeAgo(updatedAt.toDateString())}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
