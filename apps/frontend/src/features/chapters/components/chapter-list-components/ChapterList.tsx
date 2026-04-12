import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLayoutEffect, useRef } from "react";
import type { ChapterThumbnailDTO } from "@repo/contracts/dto/chapter";
import { NO_IMAGE_URL } from "@/shared/constants";
import LockIcon from "@/assets/icons/LockIcon";
import { novelQueryOptions } from "@/features/novels/api/fetchNovel";
import { novelChaptersQueryOptions } from "../../api/fetchNovelChapters";
import { useNavbarReadingContext } from "../../stores/ChapterMutateUI/NavbarReadingStore/NavbarReadingContext";

type Thumbnail = {
  coverImageUrl: string;
  status: number;
  active: boolean;
  novelId: string;
};

const ChapterThumbnail = ({
  id,
  title,
  chapterNumber,
  status,
  coverImageUrl,
  active,
  novelId,
}: Omit<ChapterThumbnailDTO, "createdAt" | "status"> & Thumbnail) => {
  const { dispatch } = useNavbarReadingContext();

  return (
    <Link
      to="/novels/$novelId/chapters/$chapterId"
      params={{ novelId: novelId, chapterId: id }}
      onClick={() => dispatch({ type: "closeListChaptersOpen" })}
    >
      <li
        data-current={active}
        className="relative overflow-hidden flex bg-black/2 dark:bg-white/2 rounded-lg p-3 pl-4 w-full data-[current=true]:bg-blue-600/15 dark:data-[current=true]:bg-blue-700/15"
      >
        <div className="flex gap-4">
          <img
            src={coverImageUrl}
            className="object-cover object-top h-11 w-11 rounded-lg"
          />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground/90">{title}</span>
            <h3 className="text-[14px] font-semibold">
              Chapter {chapterNumber}
            </h3>
          </div>
        </div>
        {active && (
          <div className="absolute top-0 -left-3.75 bg-blue-500 h-full w-5 rounded-r-[9px]" />
        )}
        {status == 1 && (
          <div className="flex items-center">
            <LockIcon className={"w-5 h-5"} />
          </div>
        )}
      </li>
    </Link>
  );
};

export const ChapterList = ({
  novelId,
  activeId,
}: {
  novelId: string;
  activeId: string;
}) => {
  const { data: chapters, isSuccess } = useSuspenseQuery(
    novelChaptersQueryOptions({ novelId }),
  );
  const { data: novel, isSuccess: novelIsSuccess } = useSuspenseQuery(
    novelQueryOptions(novelId),
  );
  const listRef = useRef<HTMLUListElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (activeItemRef.current && listRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeId]);

  return (
    <ul
      ref={listRef}
      className="flex flex-col size-full pl-4 pb-2 pt-4 pr-2 gap-2 overflow-y-auto"
    >
      {novelIsSuccess && isSuccess && chapters.length > 0 ? (
        chapters.map((chapter) => {
          const isActive = activeId == chapter.id;
          return (
            <div key={chapter.id} ref={isActive ? activeItemRef : null}>
              <ChapterThumbnail
                id={chapter.id}
                novelId={novelId}
                title={chapter.title}
                chapterNumber={chapter.chapterNumber}
                access={chapter.access}
                coverImageUrl={novel.coverImageUrl ?? NO_IMAGE_URL}
                updatedAt={chapter.updatedAt}
                status={0}
                active={isActive}
              />
            </div>
          );
        })
      ) : (
        <h1>No Results</h1>
      )}
    </ul>
  );
};
