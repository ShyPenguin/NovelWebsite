import { useNavbarReadingContext } from "../../stores/ChapterMutateUI/NavbarReadingStore/NavbarReadingContext";
import { SidebarAnimated } from "../../../../shared/components/SidebarAnimated";
import { Suspense } from "react";
import { UpperNovelPart } from "./UpperNovelPart";
import { ChapterList } from "./ChapterList";
import { useParams } from "@tanstack/react-router";

export const ChapterListSetting = ({ id }: { id: string }) => {
  const { dispatch } = useNavbarReadingContext();
  const { novelId } = useParams({
    from: "/novels_/$novelId/chapters_/$chapterId/",
  });
  return (
    <SidebarAnimated
      onClose={() => dispatch({ type: "closeListChaptersOpen" })}
    >
      <div className="flex flex-col size-full">
        <Suspense fallback={<SkeletonUpperNovelPart />}>
          <UpperNovelPart novelId={novelId} />
        </Suspense>
        <Suspense fallback={<SkeletonChapterList />}>
          <ChapterList novelId={novelId} activeId={id} />
        </Suspense>
      </div>
    </SidebarAnimated>
  );
};

const SkeletonChapterList = () => {
  return (
    <div className="flex flex-col size-full pl-4 pb-2 pt-4 pr-2 gap-2 overflow-y-scroll">
      <div className="flex gap-4 bg-black/2 dark:bg-white/2 rounded-lg p-3 pl-4 w-full">
        <div className="h-11 w-11 animate-pulse skeleton-color rounded-md" />
        <div className="h-11 w-full animate-pulse skeleton-color rounded-md" />
      </div>
      <div className="flex gap-4 bg-black/2 dark:bg-white/2 rounded-lg p-3 pl-4 w-full">
        <div className="h-11 w-11 animate-pulse skeleton-color rounded-md" />
        <div className="h-11 w-full animate-pulse skeleton-color rounded-md" />
      </div>
      <div className="flex gap-4 bg-black/2 dark:bg-white/2 rounded-lg p-3 pl-4 w-full">
        <div className="h-11 w-11 animate-pulse skeleton-color rounded-md" />
        <div className="h-11 w-full animate-pulse skeleton-color rounded-md" />
      </div>
      <div className="flex gap-4 bg-black/2 dark:bg-white/2 rounded-lg p-3 pl-4 w-full">
        <div className="h-11 w-11 animate-pulse skeleton-color rounded-md" />
        <div className="h-11 w-full animate-pulse skeleton-color rounded-md" />
      </div>
      <div className="flex gap-4 bg-black/2 dark:bg-white/2 rounded-lg p-3 pl-4 w-full">
        <div className="h-11 w-11 animate-pulse skeleton-color rounded-md" />
        <div className="h-11 w-full animate-pulse skeleton-color rounded-md" />
      </div>
      <div className="flex gap-4 bg-black/2 dark:bg-white/2 rounded-lg p-3 pl-4 w-full">
        <div className="h-11 w-11 animate-pulse skeleton-color rounded-md" />
        <div className="h-11 w-full animate-pulse skeleton-color rounded-md" />
      </div>
      <div className="flex gap-4 bg-black/2 dark:bg-white/2 rounded-lg p-3 pl-4 w-full">
        <div className="h-11 w-11 animate-pulse skeleton-color rounded-md" />
        <div className="h-11 w-full animate-pulse skeleton-color rounded-md" />
      </div>
    </div>
  );
};

const SkeletonUpperNovelPart = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="h-37.5 w-full animate-pulse skeleton-color" />
      <div className="flex flex-col p-4 border-b gap-1 border-b-black/10 dark:border-b-white/10 ">
        <div className="w-full h-6.5 animate-pulse skeleton-color rounded-md" />
        <div className="w-full h-4 animate-pulse skeleton-color rounded-md" />
      </div>
    </div>
  );
};
