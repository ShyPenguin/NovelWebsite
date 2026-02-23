import { Link } from "@tanstack/react-router";
import { OpenPaper } from "../../assets/icons/Index";
import type { NovelTrend } from "../../types";
import { NO_IMAGE_URL } from "@/constants";

export const TrendingItem = ({
  id,
  rank,
  title,
  coverImageUrl,
  totalChapters,
}: NovelTrend & { rank: number }) => {
  return (
    <Link
      to="/novels/$novelId/chapters"
      params={{ novelId: id }}
      search={{ page: 1, sort: "desc", search: "" }}
    >
      <div className="card flex p-2 gap-4 size-full">
        <h2 className="flex flex-col justify-center font-bold text-lg">
          #{rank}
        </h2>
        <img
          src={coverImageUrl ?? NO_IMAGE_URL}
          className="h-full w-8.75 object-scale-down rounded"
        />
        <div className="flex flex-col items-start size-full gap-1">
          <h2 className="text-left text-[16px] font-bold line-clamp-1">
            {title}
          </h2>
          <div className="flex h-full gap-1 text-left justify-start items-center text-muted-foreground">
            <OpenPaper className="h-4 w-4" />
            <p className="flex flex-row text-muted-foreground text-[12px] line-clamp-1">
              {totalChapters} chapters
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
