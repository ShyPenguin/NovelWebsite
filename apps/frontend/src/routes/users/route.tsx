import { UserPage } from "@/features/users/pages/UserPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users")({
  component: UserPage,
});
