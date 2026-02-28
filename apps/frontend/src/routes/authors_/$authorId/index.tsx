import { authorQueryOptions } from "@/features/authors/api/fetchAuthor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import AuthorDetail from "@/features/authors/AuthorDetail";

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

  component: RouteComponent,
});

function RouteComponent() {
  const { authorId } = Route.useParams();

  const { data: author } = useQuery(authorQueryOptions(authorId));

  return <AuthorDetail author={author!} />;
}
