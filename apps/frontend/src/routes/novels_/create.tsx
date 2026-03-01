import NovelCreatePage from "@/features/novels/pages/NovelCreatePage";
import { requireRoles } from "@/shared/utils/requireRoles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/novels_/create")({
  component: NovelCreatePage,
  beforeLoad: async ({ context: { queryClient } }) => {
    const url = `/novels/create`;
    await requireRoles({
      queryClient,
      roles: ["staff", "admin"],
      location: url,
    });
  },
});
