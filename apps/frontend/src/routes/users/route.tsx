import { checkUserPermission } from "@/features/auth/utils/check-user-permission";
import { UserPage } from "@/features/users/pages/UserPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users")({
  component: UserPage,
  beforeLoad: async () => {
    const url = `/`;
    await checkUserPermission({
      feature: "usersDirectory",
      location: url,
    });
  },
});
