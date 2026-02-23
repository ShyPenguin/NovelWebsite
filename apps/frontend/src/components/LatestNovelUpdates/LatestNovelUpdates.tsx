import { Suspense, useMemo, useState } from "react";
import { Book } from "../../assets/icons/Index";
import { LatestCard } from "./LatestCard";
import { DualTab } from "./DualTab";
import { latestChaptersOptions } from "../../api/chapters/fetchLatestChapters";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EmblaCarousel } from "../EmbaCarousel";
import SkeletonNovelUpdates from "./SkeletonNovelUpdates";

export const Content = ({ paidTab }: { paidTab: boolean }) => {
  const { data: chapters, isError } = useSuspenseQuery(latestChaptersOptions());

  const filteredChapters = useMemo(() => {
    if (isError) return [];
    return paidTab ? chapters.paid : chapters.free;
  }, [chapters, paidTab]);

  return (
    <EmblaCarousel>
      {filteredChapters.map((chapter) => {
        return (
          <LatestCard
            paid={paidTab}
            id={chapter.id}
            novel={chapter.novel}
            title={chapter.title}
            chapterNumber={chapter.chapterNumber}
            dateRelease={chapter.updatedAt}
          />
        );
      })}
    </EmblaCarousel>
  );
};
export const LatestNovelUpdates = () => {
  const [paidTab, setPaidTab] = useState(false);

  return (
    <div className="flex flex-col w-full bg-inherit dark:bg-inherit gap-1">
      <div className="flex w-full h-12.5">
        <div className="flex-center gap-2">
          <Book className="w-6 h-6" />
          <h1 className="mr-2">Latest Novel Updates</h1>
          <div className="w-45 lg:w-47.75 h-8.75 text-xs">
            <DualTab
              firstTab={paidTab}
              setFirstTab={setPaidTab}
              firstTabName="Free"
              secondTabName="Paid"
            />
          </div>
        </div>
      </div>
      <Suspense fallback={<SkeletonNovelUpdates />}>
        <Content paidTab={paidTab} />
      </Suspense>
    </div>
  );
};
