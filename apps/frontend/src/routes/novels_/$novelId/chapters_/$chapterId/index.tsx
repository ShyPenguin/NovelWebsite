import { createFileRoute } from "@tanstack/react-router";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { fetchChapterQueryOptions } from "@/features/chapters/api/fetchChapter";
import { ChapterPage } from "@/features/chapters/pages/ChapterPage";

export const Route = createFileRoute("/novels_/$novelId/chapters_/$chapterId/")(
  {
    loader: ({ context: { queryClient }, params: { chapterId } }) => {
      return queryClient.ensureQueryData(
        fetchChapterQueryOptions({ chapterId: chapterId }),
      );
    },
    pendingComponent: () => (
      <div className="min-h-screen flex-center">
        <LoadingSpinner text="Loading Chapter" />
      </div>
    ),
    notFoundComponent: () => {
      return <h4 className="test-inherit text-xxs">Chapter not found</h4>;
    },
    component: ChapterPage,
  },
);
