import { RouteDropdown } from "@/shared/components/DropdownButtons/RouteDropdown";
import Page from "@/shared/components/Page";
import { getRouteApi, Outlet } from "@tanstack/react-router";
import UserSearch from "../components/UserSearch";
import type { DropdownOption } from "@/shared/types";
import { parseKeysToLabel } from "@/shared/utils/parseKeysToLabel";
import {
  userSortWithDirection,
  userRolesQuery,
} from "@repo/contracts/fields/users";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Pagination from "@/shared/components/Pagination/Pagination";
import { usersPaginatedQueryOption } from "../api/fetchUsers";

const options: DropdownOption[] = userSortWithDirection
  .filter((item) => item.includes("desc"))
  .map((item) => {
    return {
      value: item,
      label: parseKeysToLabel(item),
    };
  });

const optionsRole: DropdownOption[] = userRolesQuery.map((item) => {
  return {
    value: item,
    label: parseKeysToLabel(item),
  };
});

export const UserPage = () => {
  const route = getRouteApi("/users/");
  const { sort, role } = route.useSearch();
  const selectedOption = options.find((option) => option.value == sort);
  const selectedOptionRole = optionsRole.find((option) => option.value == role);

  return (
    <Page>
      <Page.Header title={"All Users"} />
      <Page.Body>
        {/* SEARCH */}
        <Page.Searchbar>
          <UserSearch />
        </Page.Searchbar>
        <div className="max-w-155">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-6 lg:col-span-4">
              <RouteDropdown
                options={options}
                selectedOption={selectedOption ? selectedOption : options[0]}
                label={"Order by"}
                route={"/users"}
                filter={"sort"}
                className="max-w-none"
              />
            </div>
            <div className="col-span-6 lg:col-span-4">
              <RouteDropdown
                options={optionsRole}
                selectedOption={
                  selectedOptionRole ? selectedOptionRole : optionsRole[0]
                }
                label={"Series Role"}
                route={"/users"}
                filter={"role"}
                className="max-w-none"
              />
            </div>
          </div>
        </div>
        {/* LIST RESULT FROM THE SEARCH */}
        <Outlet />
      </Page.Body>
      <Page.Footer>
        <Suspense>
          <UserPagination />
        </Suspense>
      </Page.Footer>
    </Page>
  );
};

const UserPagination = () => {
  const routeApi = getRouteApi("/users/");
  const { page, search, role, sort } = routeApi.useSearch();
  const { data, isSuccess } = useSuspenseQuery(
    usersPaginatedQueryOption({
      search,
      page,
      role,
      sort,
    }),
  );

  return (
    <Pagination
      currentPage={page}
      totalPage={(isSuccess && data.totalPage) || 1}
      route="/users/"
    />
  );
};
