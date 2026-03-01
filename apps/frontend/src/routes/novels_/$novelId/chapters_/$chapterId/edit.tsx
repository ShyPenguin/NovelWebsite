import { createFileRoute } from "@tanstack/react-router";
import { ChapterEditPage } from "@/features/chapters/pages/ChapterEditPage";
import { fetchChapterQueryOptions } from "@/features/chapters/api/fetchChapter";
import { novelQueryOptions } from "@/features/novels/api/fetchNovel";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";

export const Route = createFileRoute(
  "/novels_/$novelId/chapters_/$chapterId/edit",
)({
  loader: async ({
    context: { queryClient },
    params: { chapterId, novelId },
  }) => {
    const chapter = await queryClient.ensureQueryData(
      fetchChapterQueryOptions({ chapterId: chapterId }),
    );
    const novel = await queryClient.ensureQueryData(novelQueryOptions(novelId));
    return { chapter, novel };
  },
  pendingComponent: () => (
    <div className="min-h-screen flex-center">
      <LoadingSpinner text="Loading Chapter" />
    </div>
  ),
  notFoundComponent: () => {
    return <h4 className="test-inherit text-xxs">Chapter not found</h4>;
  },
  component: ChapterEditPage,
});
