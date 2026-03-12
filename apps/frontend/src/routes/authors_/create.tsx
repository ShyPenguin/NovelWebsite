import { createFileRoute } from "@tanstack/react-router";
import { AuthorCreatePage } from "@/features/authors/pages/AuthorCreatePage";
import { checkUserPermission } from "@/features/auth/utils/check-user-permission";

export const Route = createFileRoute("/authors_/create")({
  component: AuthorCreatePage,
  beforeLoad: async () => {
    const url = `/`;
    await checkUserPermission({
      resource: "authors",
      action: "create",
      ctx: {},
      location: url,
    });
  },
});
