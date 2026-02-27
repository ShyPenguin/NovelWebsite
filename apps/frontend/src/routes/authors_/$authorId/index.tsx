import { authorQueryOptions } from "@/authors/api/fetchAuthor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
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

  component: RouteComponent,
});

function RouteComponent() {
  const authorRoute = Route.useLoaderData();

  const { data: author } = useQuery(authorQueryOptions(authorRoute.id));

  return (
    <div className="flex flex-col">
      <h1 className="">Name: {author?.name}</h1>
      <h2 className="">Id: {author?.id}</h2>
      <p className="">Novels: </p>
      {author?.novels.map((novel) => (
        <div className="flex flex-col">
          <p>{novel.title}</p>
        </div>
      ))}
    </div>
  );
}
