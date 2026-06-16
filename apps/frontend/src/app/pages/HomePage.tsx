import { Trending } from "@/features/novels/components/trending/Trending";
import { LatestNovelUpdates } from "@/features/novels/components/latest-novel-updates/LatestNovelUpdates";
import { NovelCards } from "@/features/novels/components/novel-cards-carousel/NovelCards";
import { SkeletonNovelCards } from "@/features/novels/components/novel-cards-carousel/SkeletonNovelCards";
import { Suspense } from "react";
import { Header } from "../components/Header";
import { useSuspenseQuery } from "@tanstack/react-query";
import { announcementsPaginatedQueryOption } from "@/features/announcements/api/fetchAnnouncements";
import Paper from "@/assets/icons/Paper";
import { ANNOUNCEMENT_SEARCH_DEFAULT } from "@/features/announcements/announcement.schema";
import { AnnouncementThumbnail } from "@/features/announcements/components/AnnouncementThumbnail";
import { Link } from "@tanstack/react-router";

const Announcements = () => {
  const { data: announcements, isSuccess } = useSuspenseQuery(
    announcementsPaginatedQueryOption({ search: "", page: 1, pageSize: 3 }),
  );
  return (
    <>
      {isSuccess && (
        <div className="flex flex-col gap-2 size-full lg:pr-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span>
                <Paper className="w-7 h-7" />
              </span>
              <h1>Announcements</h1>
            </div>
            <Link
              className="text-sm text-shadow-muted-foreground underline cursor-pointer"
              to={"/announcements"}
              search={ANNOUNCEMENT_SEARCH_DEFAULT}
            >
              View All
            </Link>
          </div>
          <h5>The latest news on our website.</h5>
          {announcements.items.length > 0 ? (
            announcements.items.map((announcement) => (
              <AnnouncementThumbnail {...announcement} key={announcement.id} />
            ))
          ) : (
            <div className="flex-center size-full">
              <h1>There is no announcement made</h1>
            </div>
          )}
        </div>
      )}
    </>
  );
};

function SkeletonAnnouncements() {
  return (
    <div className="animate-pulse skeleton-color w-full h-full rounded-2xl" />
  );
}

const HomePage = () => {
  return (
    <div className="size-full grid grid-cols-12 py-4 gap-y-4 text-inherit bg-inherit dark:bg-inherit dark:text-inherit">
      {/* TOP PART WITH ANNOUNCEMENT AND HEADER */}
      <div className="col-span-full grid grid-cols-12 h-full lg:h-62.5 lg:gap-x-8 gap-y-4 px-4 md:px-20 lg:px-0">
        <div className="col-span-full h-full lg:col-span-8">
          <Header />
        </div>
        <div className="col-span-full h-full lg:col-span-4">
          <Suspense fallback={<SkeletonAnnouncements />}>
            <Announcements />
          </Suspense>
        </div>
      </div>

      {/* NOVEL CARDS INFINITE CAROUSEL*/}
      <div className="col-span-full max-h-70">
        <Suspense fallback={<SkeletonNovelCards />}>
          <NovelCards />
        </Suspense>
      </div>

      {/* BOTTOM PART WITH LATEST AND TRENDING */}
      <div className="col-span-full grid grid-cols-12 gap-4 px-4 md:px-20 lg:px-4">
        {/* BOTTOM PART LEFT */}
        <div className="col-span-full lg:col-span-8 flex flex-col gap-4 lg:mr-10">
          <LatestNovelUpdates />
        </div>

        {/* BOTTOM PART RIGHT */}
        <div className="col-span-full lg:col-span-4">
          <Trending />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
