import { fetchUserQueryOptions } from "@/features/users/api/fetchUser";
import { UserDetailPage } from "@/features/users/pages/UserDetailPage";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users_/$username/")({
  loader: ({ context: { queryClient }, params: { username } }) => {
    return queryClient.ensureQueryData(fetchUserQueryOptions(username));
  },
  pendingComponent: () => (
    <div className="min-h-screen flex-center">
      <LoadingSpinner text="Loading Novel" />
    </div>
  ),
  notFoundComponent: () => {
    return <h4 className="test-inherit text-xxs">User not found</h4>;
  },
  component: UserDetailPage,
});
