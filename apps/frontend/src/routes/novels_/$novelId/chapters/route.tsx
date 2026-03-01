import { createFileRoute } from "@tanstack/react-router";
import { novelQueryOptions } from "../../../../features/novels/api/fetchNovel";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import { NovelChaptersPage } from "@/features/novels/pages/NovelChaptersPage";

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
    return <h4 className="test-inherit text-xxs">Novel not found</h4>;
  },
  component: NovelChaptersPage,
});
