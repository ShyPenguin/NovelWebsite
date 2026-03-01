import { ProtectedLink } from "@/features/auth/components/ProtectedLink";
import Page from "@/shared/components/Page";
import Pagination from "@/shared/components/Pagination/Pagination";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { authorsPaginatedQueryOption } from "../api/fetchAuthors";
import AuthorSearch from "../components/AuthorSearch";

export const AuthorPage = () => {
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
        {/* LIST OF AUTHORS */}
        <Outlet />
      </Page.Body>
      <Page.Footer>
        <Suspense>
          <AuthorPagination />
        </Suspense>
      </Page.Footer>
    </Page>
  );
};

const AuthorPagination = () => {
  const routeApi = getRouteApi("/authors/");
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
