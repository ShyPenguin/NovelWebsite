import { checkUserPermission } from "@/features/auth/utils/check-user-permission";
import NovelCreatePage from "@/features/novels/pages/NovelCreatePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/novels_/create")({
  component: NovelCreatePage,
  beforeLoad: async () => {
    const url = `/`;
    await checkUserPermission({
      resource: "novels",
      action: "create",
      ctx: {},
      location: url,
    });
  },
});
