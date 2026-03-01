import { authorQueryOptions } from "@/features/authors/api/fetchAuthor";
import AuthorDetail from "@/features/authors/components/AuthorDetail";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/authors_/$authorId/")({
  loader: ({ context: { queryClient }, params: { authorId } }) => {
    return queryClient.ensureQueryData(authorQueryOptions(authorId));
  },
  pendingComponent: () => (
    <div className="min-h-screen flex-center">
      <LoadingSpinner text="Loading Author" />
    </div>
  ),
  notFoundComponent: () => {
    return <h4 className="test-inherit text-xxs">Author not found</h4>;
  },
  component: AuthorDetail,
});
