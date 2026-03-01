import { Chevron, House } from "../../../../assets/icons/Index";
import ReadingSettingButton from "../reading-setting-components/ReadingSettingButton";
import ChapterListSettingButton from "../chapter-list-components/ChapterListSettingButton";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageNavbar } from "../../../../shared/layouts/PageNavbar";
import { fetchChapterQueryOptions } from "../../api/fetchChapter";
import { CHAPTER_SEARCH_DEFAULT } from "../../chapter.schema";

const NavbarReading = () => {
  return (
    <PageNavbar>
      <Content />
    </PageNavbar>
  );
};

const Content = () => {
  const { novelId, chapterId } = useParams({
    from: "/novels_/$novelId/chapters_/$chapterId/",
  });

  const {
    data: chapter,
    isLoading: chapterIsLoading,
    isSuccess: chapterIsSuccess,
  } = useQuery(fetchChapterQueryOptions({ chapterId }));

  return (
    <div className="flex container justify-between items-center px-4 py-3">
      <div className="flex items-center justify-center">
        {chapterIsLoading && (
          <div className="w-[50px] h-[40px] animate-pulse skeleton-color rounded-xl" />
        )}
        {chapterIsSuccess && chapter.prevChapter && (
          <Link
            to="/novels/$novelId/chapters/$chapterId"
            params={{
              novelId: novelId,
              chapterId: chapter.prevChapter,
            }}
            className="reading-setting-card reading-setting-card-hover rounded-xl w-12"
          >
            <Chevron
              isOpen={false}
              initialRotation="rotate-90"
              className="w-6"
            />
          </Link>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Link
          className="reading-setting-card reading-setting-card-hover rounded-xl w-12"
          to="/novels/$novelId/chapters"
          params={{ novelId: novelId }}
          search={CHAPTER_SEARCH_DEFAULT}
        >
          <House className="w-[17px]" />
        </Link>
      </div>
      {/* NEXT BUTTON */}
      <div className="flex items-center gap-x-3">
        <ReadingSettingButton />
        <ChapterListSettingButton />
        {chapterIsLoading && (
          <div className="w-[50px] h-[40px] animate-pulse skeleton-color rounded-xl" />
        )}
        {chapterIsSuccess && chapter.nextChapter && (
          <Link
            to="/novels/$novelId/chapters/$chapterId"
            params={{
              novelId: novelId,
              chapterId: chapter.nextChapter,
            }}
            className="reading-setting-card reading-setting-card-hover rounded-xl w-12"
          >
            <Chevron
              isOpen={false}
              initialRotation="rotate-270"
              className="w-6"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavbarReading;
