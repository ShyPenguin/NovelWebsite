import { useSuspenseQuery } from "@tanstack/react-query";
import { novelChaptersPaginatedQueryOptions } from "../../api/chapters/fetchNovelChapters";
import { ChapterThumbnail } from "./ChapterThumbnail";
import { memo, useState } from "react";
import { Chevron } from "../../assets/icons/Index";
import HorizontalLine from "../HorizontalLine";
import Pagination from "../Pagination/Pagination";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/novels_/$novelId/chapters/");

const Content = () => {
  const { page, sort, search } = routeApi.useSearch();
  const { novelId } = routeApi.useParams();

  const { isSuccess, data } = useSuspenseQuery(
    novelChaptersPaginatedQueryOptions({
      novelId: novelId,
      page: page,
      sort: sort,
      search: search,
    }),
  );
  return (
    <ul className="flex flex-col gap-5">
      {isSuccess && data.items.length > 0 ? (
        data.items.map((chapter) => {
          return (
            <ChapterThumbnail
              key={chapter.id}
              id={chapter.id}
              novelId={novelId}
              title={chapter.title}
              chapterNumber={chapter.chapterNumber}
              updatedAt={chapter.updatedAt}
            />
          );
        })
      ) : (
        <div>Empty Data</div>
      )}
    </ul>
  );
};

const MemoizedContent = memo(Content);

const ChapterListPagination = () => {
  const { page, sort, search } = routeApi.useSearch();
  const { novelId } = routeApi.useParams();

  const { isSuccess, data } = useSuspenseQuery(
    novelChaptersPaginatedQueryOptions({
      novelId: novelId,
      page: page,
      sort: sort,
      search: search,
    }),
  );
  return (
    <div className="w-full h-10">
      <Pagination
        currentPage={page}
        totalPage={(isSuccess && data.totalPage) || 1}
        route="/novels_/$novelId/chapters/"
      />
    </div>
  );
};

const MemoizedChapterListPagination = memo(ChapterListPagination);

const ChapterList = () => {
  const [display, setDisplay] = useState(true);
  return (
    <>
      <button
        className="flex justify-between items-center hover:underline font-medium p-2"
        onClick={() => setDisplay((prev) => !prev)}
      >
        Free Chapters
        <Chevron isOpen={display} />
      </button>

      <div className={`${!display && "hidden"}`}>
        <MemoizedContent />
      </div>
      <HorizontalLine />
      <MemoizedChapterListPagination />
    </>
  );
};

export default ChapterList;
