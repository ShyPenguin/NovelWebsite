import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { announcementsPaginatedQueryOption } from "../api/fetchAnnouncements";
import { AnnouncementThumbnail } from "./AnnouncementThumbnail";

export const AnnouncementPageContent = () => {
  return (
    <div className="mt-7">
      <Suspense fallback={<SkeletonAnnouncements />}>
        <Content />
      </Suspense>
    </div>
  );
};

const Content = () => {
  const route = getRouteApi("/announcements/");
  const { search, page } = route.useSearch();
  const { data: announcements, isSuccess } = useSuspenseQuery(
    announcementsPaginatedQueryOption({
      search,
      page,
    }),
  );

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {isSuccess && announcements.items.length > 0 ? (
        announcements.items.map((announcement) => (
          <li key={announcement.id}>
            <AnnouncementThumbnail {...announcement} />
          </li>
        ))
      ) : (
        <h1>No Results</h1>
      )}
    </ul>
  );
};
function SkeletonAnnouncements() {
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
