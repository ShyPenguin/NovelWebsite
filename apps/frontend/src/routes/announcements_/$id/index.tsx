import { announcementQueryOptions } from "@/features/announcements/api/fetchAnnouncement";
import { AnnouncementDetailPage } from "@/features/announcements/pages/AnnouncementDetailPage";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { NotFound } from "@/shared/components/NotFound";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/announcements_/$id/")({
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(announcementQueryOptions(id));
  },
  pendingComponent: () => (
    <div className="min-h-screen flex-center">
      <LoadingSpinner text="Loading Novel" />
    </div>
  ),
  notFoundComponent: () => {
    return <NotFound resource="novels" />;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: announcement } = useQuery(announcementQueryOptions(id));
  return <AnnouncementDetailPage announcement={announcement!} />;
}
