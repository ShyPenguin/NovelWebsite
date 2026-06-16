import { AnnouncementCreatePage } from "@/features/announcements/pages/AnnouncementCreatePage";
import { checkUserPermission } from "@/features/auth/utils/check-user-permission";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/announcements_/create")({
  component: AnnouncementCreatePage,
  beforeLoad: async () => {
    const url = `/announcements`;
    await checkUserPermission({
      resource: "announcements",
      action: "create",
      ctx: {},
      location: url,
    });
  },
});
