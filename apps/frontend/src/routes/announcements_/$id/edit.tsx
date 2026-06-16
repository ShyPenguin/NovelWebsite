import { announcementQueryOptions } from "@/features/announcements/api/fetchAnnouncement";
import { AnnouncementEditPage } from "@/features/announcements/pages/AnnouncementEditPage";
import { checkUserPermission } from "@/features/auth/utils/check-user-permission";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { NotFound } from "@/shared/components/NotFound";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/announcements_/$id/edit")({
  loader: async ({ context: { queryClient }, params: { id } }) => {
    const url = `/announcements/${id}`;

    await checkUserPermission({
      resource: "announcements",
      action: "update",
      ctx: {},
      location: url,
    });

    return queryClient.ensureQueryData(announcementQueryOptions(id));
  },
  pendingComponent: () => (
    <div className="min-h-screen flex-center">
      <LoadingSpinner text="Loading Chapter" />
    </div>
  ),
  notFoundComponent: () => {
    return <NotFound resource="chapters" />;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: announcement } = useQuery(announcementQueryOptions(id));
  return <AnnouncementEditPage announcement={announcement!} />;
}
