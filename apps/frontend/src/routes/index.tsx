import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Announcements } from "../components/Announcements";
import { NovelCards } from "../components/NovelCardsCarousel/NovelCards";
import { LatestNovelUpdates } from "../components/LatestNovelUpdates/LatestNovelUpdates";
import { Trending } from "../components/Trending/Trending";
import { Suspense } from "react";
import { SkeletonNovelCards } from "../components/NovelCardsCarousel/SkeletonNovelCards";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="size-full grid grid-cols-12 py-4 gap-y-4 text-inherit bg-inherit dark:bg-inherit dark:text-inherit">
      {/* TOP PART WITH ANNOUNCEMENT AND HEADER */}
      <div className="col-span-full grid grid-cols-12 h-full lg:h-62.5 lg:gap-x-8 gap-y-4 px-4 md:px-20 lg:px-0">
        <div className="col-span-full h-full lg:col-span-8">
          <Header />
        </div>
        <div className="col-span-full h-full lg:col-span-4">
          <Announcements />
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
}
