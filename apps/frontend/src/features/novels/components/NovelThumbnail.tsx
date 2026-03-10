import { CHAPTER_SEARCH_DEFAULT } from "@/features/chapters/chapter.schema";
import { NO_IMAGE_URL } from "@/shared/constants";
import type { NovelThumbnailDTO } from "@repo/contracts/dto/novel";
import { Link } from "@tanstack/react-router";

export const NovelThumbnail = ({ novel }: { novel: NovelThumbnailDTO }) => {
  return (
    <Link
      className="flex w-full gap-4 relative"
      to="/novels/$novelId/chapters"
      params={{ novelId: novel.id }}
      search={CHAPTER_SEARCH_DEFAULT}
    >
      <img
        className="h-full min-h-36.5 lg:min-h-45 w-25 lg:w-30 rounded-2xl object-cover"
        src={novel.coverImageUrl ? novel.coverImageUrl : NO_IMAGE_URL}
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-primary-black dark:text-white font-bold text-lg line-clamp-1">
          {novel.title}
        </h1>
        <div className="flex flex-col gap-2">
          <p className="line-clamp-5 text-[14px]">{novel.description}</p>
        </div>
      </div>
    </Link>
  );
};
