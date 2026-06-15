import Page from "@/shared/components/Page";
import Pagination from "@/shared/components/Pagination/Pagination";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, Outlet, getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { announcementsPaginatedQueryOption } from "../api/fetchAnnouncements";
import { Can } from "@/features/auth/components/Can";
import AnnouncementSearch from "../components/AnnouncementSearch";

export const AnnouncementPage = () => {
  return (
    <Page>
      <Page.Header title={"All Announcements"} />
      <Page.Body>
        <Page.Searchbar>
          <AnnouncementSearch />
        </Page.Searchbar>
        <Can resource="announcements" action="create" ctx={{}}>
          <Link
            to="/announcements/create"
            className="full-button max-w-37.5 bg-secondary dark:bg-secondary-black dark:text-white col-span-full lg:col-span-4"
          >
            Create Announcement
          </Link>
        </Can>
        {/* LIST OF ANNOUNCEMENTS */}
        <Outlet />
      </Page.Body>
      <Page.Footer>
        <Suspense>
          <AnnouncementPagination />
        </Suspense>
      </Page.Footer>
    </Page>
  );
};

const AnnouncementPagination = () => {
  const routeApi = getRouteApi("/announcements/");
  const { page, search } = routeApi.useSearch();
  const { data, isSuccess } = useSuspenseQuery(
    announcementsPaginatedQueryOption({
      search,
      page,
    }),
  );
  return (
    <Pagination
      currentPage={page}
      totalPage={(isSuccess && data.totalPage) || 1}
      route="/announcements/"
    />
  );
};
