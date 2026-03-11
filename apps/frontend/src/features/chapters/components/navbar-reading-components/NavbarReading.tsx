import ReadingSettingButton from "../reading-setting-components/ReadingSettingButton";
import ChapterListSettingButton from "../chapter-list-components/ChapterListSettingButton";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageNavbar } from "@/shared/layouts/PageNavbar";
import { fetchChapterQueryOptions } from "../../api/fetchChapter";
import { CHAPTER_SEARCH_DEFAULT } from "../../chapter.schema";
import { Chevron } from "@/assets/icons/Chevron";
import House from "@/assets/icons/House";

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

  const ArrowButton = ({ direction }: { direction: "left" | "right" }) => {
    const id =
      direction == "left" ? chapter?.prevChapter : chapter?.nextChapter;

    return (
      <>
        {chapterIsSuccess && id ? (
          <Link
            to="/novels/$novelId/chapters/$chapterId"
            params={{
              novelId: novelId,
              chapterId: id,
            }}
            className="reading-setting-card reading-setting-card-hover rounded-xl w-12"
          >
            <Chevron
              isOpen={false}
              initialRotation={direction == "left" ? "rotate-90" : "rotate-270"}
              className="w-6"
            />{" "}
          </Link>
        ) : (
          <Link
            to="/novels/$novelId/chapters"
            params={{
              novelId: novelId,
            }}
            search={CHAPTER_SEARCH_DEFAULT}
            className="reading-setting-card reading-setting-card-hover rounded-xl w-12"
          >
            <Chevron
              isOpen={false}
              initialRotation={direction == "left" ? "rotate-90" : "rotate-270"}
              className="w-6"
            />{" "}
          </Link>
        )}
      </>
    );
  };
  return (
    <div className="flex container justify-between items-center px-4 py-3">
      <div className="flex-1 flex items-center">
        {chapterIsLoading && (
          <div className="w-12.5 h-10 animate-pulse skeleton-color rounded-xl" />
        )}
        <ArrowButton direction={"left"} />
      </div>
      <div className="flex items-center justify-center">
        <Link
          className="reading-setting-card reading-setting-card-hover rounded-xl w-12"
          to="/novels/$novelId/chapters"
          params={{ novelId: novelId }}
          search={CHAPTER_SEARCH_DEFAULT}
        >
          <House className="w-4.25" />
        </Link>
      </div>
      {/* NEXT BUTTON */}
      <div className="flex-1 flex items-center justify-end gap-x-3">
        <ReadingSettingButton />
        <ChapterListSettingButton />
        {chapterIsLoading && (
          <div className="w-12.5 h-10 animate-pulse skeleton-color rounded-xl" />
        )}
        <ArrowButton direction={"right"} />
      </div>
    </div>
  );
};

export default NavbarReading;
