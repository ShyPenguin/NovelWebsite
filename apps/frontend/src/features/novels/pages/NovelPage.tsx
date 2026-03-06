import { RouteDropdown } from "@/shared/components/DropdownButtons/RouteDropdown";
import Page from "@/shared/components/Page";
import { getRouteApi, Link, Outlet } from "@tanstack/react-router";
import NovelSearch from "../components/NovelSearch";
import type { DropdownOption } from "@/shared/types";
import { parseKeysToLabel } from "@/shared/utils/parseKeysToLabel";
import {
  novelSortWithDirection,
  novelStatusQuery,
} from "@repo/contracts/fields/novel";
import { Can } from "@/features/auth/components/Can";

const options: DropdownOption[] = novelSortWithDirection
  .filter((item) => item.includes("desc"))
  .map((item) => {
    return {
      value: item,
      label: parseKeysToLabel(item),
    };
  });
// In the future when implementing views
// { value: "views", label: "Views" },

const optionsStatus: DropdownOption[] = novelStatusQuery.map((item) => {
  return {
    value: item,
    label: parseKeysToLabel(item),
  };
});

export const NovelPage = () => {
  const route = getRouteApi("/novels/");
  const { sort, status } = route.useSearch();
  const selectedOption = options.find((option) => option.value == sort);
  const selectedOptionStatus = optionsStatus.find(
    (option) => option.value == status,
  );

  return (
    <Page>
      <Page.Header title={"All Novels"} />
      <Page.Body>
        {/* SEARCH */}
        <Page.Searchbar>
          <NovelSearch />
        </Page.Searchbar>
        <div className="max-w-155">
          <div className="grid grid-cols-12 gap-2">
            <Can resource="novels" action="create" ctx={{}}>
              <Link
                to="/novels/create"
                className="full-button bg-secondary dark:bg-secondary-black dark:text-white col-span-full lg:col-span-4"
              >
                Create Novel
              </Link>
            </Can>
            <div className="col-span-6 lg:col-span-4">
              <RouteDropdown
                options={options}
                selectedOption={selectedOption ? selectedOption : options[0]}
                label={"Order by"}
                route={"/novels"}
                filter={"sort"}
                className="max-w-none"
              />
            </div>
            <div className="col-span-6 lg:col-span-4">
              <RouteDropdown
                options={optionsStatus}
                selectedOption={
                  selectedOptionStatus ? selectedOptionStatus : optionsStatus[0]
                }
                label={"Series Status"}
                route={"/novels"}
                filter={"status"}
                className="max-w-none"
              />
            </div>
          </div>
        </div>
        {/* LIST RESULT FROM THE SEARCH */}
        <Outlet />
      </Page.Body>
    </Page>
  );
};
