import { authorsPaginatedQueryOption } from "@/features/authors/api/fetchAuthors";
import { AuthorSearchSchema } from "@/features/authors/author.schema";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/authors/")({
  validateSearch: (search) => AuthorSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mt-7">
      <Suspense fallback={<SkeletonAuthors />}>
        <Content />
      </Suspense>
    </div>
  );
}

const Content = () => {
  const { search, page } = Route.useSearch();
  const { data: authors, isSuccess } = useSuspenseQuery(
    authorsPaginatedQueryOption({
      search,
      page,
    }),
  );

  return (
    <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 list-disc pl-8">
      {isSuccess &&
        authors.items.length > 0 &&
        authors.items.map((author) => (
          <li key={author.id}>
            <Link
              to="/authors/$authorId"
              params={{ authorId: author.id }}
              className="hover:text-primary-black/80 dark:hover:text-white/80 marker"
            >
              {author.name}
            </Link>
          </li>
        ))}
    </ul>
  );
};
function SkeletonAuthors() {
  return (
    <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 pl-8">
      <li className="animate-pulse skeleton-color w-full h-10" />
      <li className="animate-pulse skeleton-color w-full h-10" />
      <li className="animate-pulse skeleton-color w-full h-10" />
      <li className="animate-pulse skeleton-color w-full h-10" />
      <li className="animate-pulse skeleton-color w-full h-10" />
      <li className="animate-pulse skeleton-color w-full h-10" />
      <li className="animate-pulse skeleton-color w-full h-10" />
      <li className="animate-pulse skeleton-color w-full h-10" />
      <li className="animate-pulse skeleton-color w-full h-10" />
      <li className="animate-pulse skeleton-color w-full h-10" />
    </ul>
  );
}
