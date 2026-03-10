import { UserPageContent } from "@/features/users/components/UserPageContent";
import { UserSearchPaginatedSchema } from "@/features/users/user.schema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/")({
  validateSearch: (search) => UserSearchPaginatedSchema.parse(search),
  component: UserPageContent,
});
