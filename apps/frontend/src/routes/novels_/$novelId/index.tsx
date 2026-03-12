import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { novelQueryOptions } from "@/features/novels/api/fetchNovel";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { NovelDetailPage } from "@/features/novels/pages/NovelDetailPage";
import { checkUserPermission } from "@/features/auth/utils/check-user-permission";
import { NotFound } from "@/shared/components/NotFound";

export const Route = createFileRoute("/novels_/$novelId/")({
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
  beforeLoad: async ({ params: { novelId } }) => {
    const url = `/novels/${novelId}/chapters`;
    await checkUserPermission({
      feature: "novelIndexPage",
      location: url,
    });
  },

  component: RouteComponent,
});

function RouteComponent() {
  const { novelId } = Route.useParams();

  const { data: novel } = useQuery(novelQueryOptions(novelId));
  return <NovelDetailPage novel={novel!} />;
}
