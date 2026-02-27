import { Outlet } from "@tanstack/react-router";
import ChapterListNoticesMain from "../../../components/ChapterListNoticesComponents/ChapterListNoticesMain";
import HorizontalLine from "../../../components/HorizontalLine";
import { Schedule } from "../../../components/Schedule/Schedule";
import BookmarkIcon from "../../../assets/icons/BookmarkIcon";
import { NovelImage } from "./NovelImage";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { NO_AUTHOR } from "@/constants";
import { ProtectedLink } from "@/components/ProtectedLink";

export const Content = ({ novel }: { novel: NovelDetailDTO }) => {
  return (
    <section className="bg-white dark:bg-primary-black z-10 relative px-4">
      <div className="grid grid-cols-12 gap-y-3 gap-x-3 px-5">
        {/* LEFT SIDE */}
        <div className="col-span-12 h-full lg:col-span-9 order-2 lg:order-1 flex flex-col gap-3">
          <h4 className="text-[30px] font-bold text-center lg:text-left">
            {novel.title}
          </h4>
          <div className="flex flex-row flex-wrap gap-2">
            <span className="status">{novel.status}</span>
          </div>
          <h5>{novel.description}</h5>
          <HorizontalLine />
          <ChapterListNoticesMain>
            <Outlet />
          </ChapterListNoticesMain>
        </div>

        {/* RIGHT SIDE  */}
        <div className="col-span-12 lg:col-span-3 order-1 lg:order-1 flex flex-col gap-y-2 items-center justify-start lg:-translate-y-32.5">
          <div className="p-1 rounded-xl overflow-hidden">
            <NovelImage coverImageUrl={novel.coverImageUrl} id={novel.id} />
          </div>
          <div className="flex w-full max-w-103.25 lg:max-w-full justify-center gap-2">
            <div className="flex flex-col items-center justify-center gap-1">
              <Bookmark bookmarked={false} />
              <p>10</p>
            </div>
            <button className="full-button h-full bg-black text-white dark:bg-white dark:text-black">
              Rate this series
            </button>
          </div>
          <div className="flex w-full max-w-103.25 lg:max-w-full ">
            <ProtectedLink
              permissionArgs={{
                resource: "chapters",
                action: "create",
              }}
              to="/novels/$novelId/chapters/create"
              params={{ novelId: novel.id }}
              className="full-button bg-secondary dark:bg-secondary-black dark:text-white"
            >
              Create Chapter
            </ProtectedLink>
          </div>
          <Schedule schedule={novel.schedule} />

          <div className="flex flex-col w-full space-y-2 px-2 py-4">
            <div className="flex justify-between">
              <h5>Release year</h5>
              <h5>{new Date(novel.release).getFullYear()}</h5>
            </div>
            <div className="flex justify-between">
              <h5>Author</h5>
              <h5>{novel.author ? novel.author.name : NO_AUTHOR}</h5>
            </div>
            <div className="flex justify-between">
              <h5>Total Chapters</h5>
              <h5>{novel.totalChapters}</h5>
            </div>
            <div className="flex justify-between">
              <h5>Bookmarks</h5>
              {/* <h5>{novel.bookmarks}</h5> */}
              <h5>10</h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Bookmark = ({ bookmarked }: { bookmarked: boolean }) => {
  return (
    <button>
      <BookmarkIcon
        bookmarked={bookmarked}
        className={"fill-current h-6 w-10"}
      />
    </button>
  );
};
