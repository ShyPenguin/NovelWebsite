import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Suspense } from "react";
import { usersPaginatedQueryOption } from "../api/fetchUsers";
import { UserThumbnail } from "./UserThumbnail";

export const UserPageContent = () => {
  return (
    <div className="mt-7 size-full">
      <Suspense fallback={<SkeletonUsers />}>
        <Content />
      </Suspense>
    </div>
  );
};

const Content = () => {
  const route = getRouteApi("/users/");
  const { search, page, sort, role } = route.useSearch();
  const { data: users } = useSuspenseQuery(
    usersPaginatedQueryOption({
      search,
      page,
      sort,
      role,
    }),
  );

  return (
    <ul className="size-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {users.items.length > 0 ? (
        users.items.map((user) => (
          <li key={user.id} className="size-full">
            <UserThumbnail {...user} />
          </li>
        ))
      ) : (
        <div>Empty Data</div>
      )}
    </ul>
  );
};
function SkeletonUsers() {
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
