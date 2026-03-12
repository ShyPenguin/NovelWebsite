import { authorQueryOptions } from "@/features/authors/api/fetchAuthor";
import { AuthorDetailPage } from "@/features/authors/pages/AuthorDetailPage";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { NotFound } from "@/shared/components/NotFound";
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
    return <NotFound resource="authors" />;
  },
  component: AuthorDetailPage,
});
