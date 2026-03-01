import { createFileRoute } from "@tanstack/react-router";
import { ChapterCreatePage } from "@/features/chapters/pages/ChapterCreatePage";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { novelQueryOptions } from "@/features/novels/api/fetchNovel";
import { requireRoles } from "@/shared/utils";

export const Route = createFileRoute("/novels_/$novelId/chapters_/create")({
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
  component: ChapterCreatePage,
  beforeLoad: async ({ context: { queryClient }, params: { novelId } }) => {
    const url = `/novels/${novelId}/chapters`;
    await requireRoles({
      queryClient,
      roles: ["staff", "admin"],
      location: url,
    });
  },
});
