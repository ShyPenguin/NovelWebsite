import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { authorsPaginatedQueryOption } from "../api/fetchAuthors";

export const AuthorPageContent = () => {
  return (
    <div className="mt-7">
      <Suspense fallback={<SkeletonAuthors />}>
        <Content />
      </Suspense>
    </div>
  );
};

const Content = () => {
  const route = getRouteApi("/authors/");
  const { search, page } = route.useSearch();
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
