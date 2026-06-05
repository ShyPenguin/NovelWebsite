import { createFileRoute } from "@tanstack/react-router";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { fetchChapterQueryOptions } from "@/features/chapters/api/fetchChapter";
import { ChapterPage } from "@/features/chapters/pages/ChapterPage";
import { NotFound } from "@/shared/components/NotFound";

export const Route = createFileRoute(
  "/novels_/$novelId_/$slug/chapters_/$chapterNumber/",
)({
  loader: ({
    context: { queryClient },
    params: { novelId, chapterNumber },
  }) => {
    return queryClient.ensureQueryData(
      fetchChapterQueryOptions({ novelId, chapterNumber }),
    );
  },
  pendingComponent: () => (
    <div className="min-h-screen flex-center">
      <LoadingSpinner text="Loading Chapter" />
    </div>
  ),
  notFoundComponent: () => {
    return <NotFound resource="chapters" />;
  },
  component: ChapterPage,
});
