import { createFileRoute } from "@tanstack/react-router";
import { novelQueryOptions } from "../../../api/novels/fetchNovel";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { requireRoles } from "../../../utils";
import { Content } from "../../../layouts/novels/novelId/Content";
import { useQuery } from "@tanstack/react-query";

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
    return <h4 className="test-inherit text-xxs">Novel not found</h4>;
  },
  beforeLoad: async ({ context: { queryClient }, params: { novelId } }) => {
    const url = `/novels/${novelId}/chapters`;
    await requireRoles({
      queryClient,
      roles: ["staff", "admin"],
      location: url,
    });
  },

  component: RouteComponent,
});

function RouteComponent() {
  const novelRouteData = Route.useLoaderData();

  const { data: novel } = useQuery(novelQueryOptions(novelRouteData.id));
  return <Content novel={novel ? novel : novelRouteData} />;
}
