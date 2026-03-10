import { Link } from "@tanstack/react-router";
import { NO_IMAGE_URL } from "@/shared/constants";
import { CHAPTER_SEARCH_DEFAULT } from "@/features/chapters/chapter.schema";
import type { NovelThumbnailDTO } from "@repo/contracts/dto/novel";

export const NovelCard = ({
  id,
  title,
  description,
  coverImageUrl,
}: NovelThumbnailDTO) => {
  return (
    <Link
      to="/novels/$novelId/chapters"
      params={{ novelId: id }}
      search={CHAPTER_SEARCH_DEFAULT}
    >
      <div className="relative flex h-62.5 w-62.5 ml-4 items-center justify-center rounded-2xl shadow lg:w-70 lg:h-70">
        <div className="absolute top-0 z-auto h-full w-full rounded-2xl bg-radial from-transparent to-black"></div>
        <img
          src={coverImageUrl ?? NO_IMAGE_URL}
          draggable="false"
          className="absolute top-0 h-full w-full rounded-2xl object-cover object-top opacity-75"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90 rounded-2xl" />
        <div
          className="absolute bottom-3 left-0 right-0 p-4 text-white text-center 
        group-data-[current=false]:opacity-0
        transition-all ease-in"
        >
          <h3 className="lg:text-[16px] font-semibold text-[12px] line-clamp-2">
            {title}
          </h3>
          <p className="mt-1 text-[8px] lg:text-[12px] line-clamp-2 lg:line-clamp-3 text-white/80">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};
