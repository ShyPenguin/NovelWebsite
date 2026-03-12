import { createFileRoute } from "@tanstack/react-router";
import { NovelChaptersPage } from "@/features/novels/pages/NovelChaptersPage";
import { novelQueryOptions } from "@/features/novels/api/fetchNovel";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { NotFound } from "@/shared/components/NotFound";

export const Route = createFileRoute("/novels_/$novelId/chapters")({
  loader: ({ context: { queryClient }, params: { novelId } }) => {
    return queryClient.ensureQueryData(novelQueryOptions(novelId));
  },
  pendingComponent: () => (
    <div className="min-h-screen flex-center">
      <LoadingSpinner text="Loading Novel" />
    </div>
  ),
  notFoundComponent: () => {
    return <NotFound resource="novels" />;
  },
  component: NovelChaptersPage,
});
