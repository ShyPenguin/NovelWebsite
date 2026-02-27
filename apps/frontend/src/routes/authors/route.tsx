import { authorsPaginatedQueryOption } from "@/api/authors/fetchAuthors";
import Pagination from "@/components/Pagination/Pagination";
import { ProtectedLink } from "@/components/ProtectedLink";
import SearchPage from "@/components/SearchPage";
import AuthorSearch from "@/layouts/authors/AuthorSearch";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, getRouteApi, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/authors")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SearchPage>
      <SearchPage.Header title={"All Authors"} />
      <SearchPage.Body>
        <SearchPage.Searchbar>
          <AuthorSearch />
        </SearchPage.Searchbar>
        <ProtectedLink
          permissionArgs={{
            resource: "authors",
            action: "create",
          }}
          to="/authors/create"
          className="full-button max-w-37.5 bg-secondary dark:bg-secondary-black dark:text-white col-span-full lg:col-span-4"
        >
          Create Author
        </ProtectedLink>
        <Outlet />
      </SearchPage.Body>
      <SearchPage.Footer>
        <Suspense>
          <AuthorPagination />
        </Suspense>
      </SearchPage.Footer>
    </SearchPage>
  );
}

const routeApi = getRouteApi("/authors/");

const AuthorPagination = () => {
  const { page, search } = routeApi.useSearch();
  const { data, isSuccess } = useSuspenseQuery(
    authorsPaginatedQueryOption({
      search,
      page,
    }),
  );
  return (
    <Pagination
      currentPage={page}
      totalPage={(isSuccess && data.totalPage) || 1}
      route="/authors/"
    />
  );
};
