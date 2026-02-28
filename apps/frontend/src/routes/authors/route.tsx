import { authorsPaginatedQueryOption } from "@/features/authors/api/fetchAuthors";
import Pagination from "@/components/Pagination/Pagination";
import { ProtectedLink } from "@/auth/components/ProtectedLink";
import Page from "@/components/Page";
import AuthorSearch from "@/features/authors/AuthorSearch";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, getRouteApi, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/authors")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page>
      <Page.Header title={"All Authors"} />
      <Page.Body>
        <Page.Searchbar>
          <AuthorSearch />
        </Page.Searchbar>
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
      </Page.Body>
      <Page.Footer>
        <Suspense>
          <AuthorPagination />
        </Suspense>
      </Page.Footer>
    </Page>
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
