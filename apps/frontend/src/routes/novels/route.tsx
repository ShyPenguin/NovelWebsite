import { createFileRoute, getRouteApi, Outlet } from "@tanstack/react-router";
import type { DropdownOption } from "../../types";
import NovelSearch from "../../components/NovelsComponents/NovelSearch";
import { RouteDropdown } from "../../components/DropdownButtons/RouteDropdown";
import {
  novelSortWithDirection,
  novelStatusQuery,
} from "@repo/contracts/fields/novel";
import { parseKeysToLabel } from "../../utils/parseKeysToLabel";
import { ProtectedLink } from "@/components/ProtectedLink";
import SearchPage from "@/components/SearchPage";

export const Route = createFileRoute("/novels")({
  component: RouteComponent,
});

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

function RouteComponent() {
  const route = getRouteApi("/novels/");
  const { sort, status } = route.useSearch();
  const selectedOption = options.find((option) => option.value == sort);
  const selectedOptionStatus = optionsStatus.find(
    (option) => option.value == status,
  );
  return (
    <SearchPage>
      <SearchPage.Header title={"All Novels"} />
      <SearchPage.Body>
        {/* SEARCH */}
        <SearchPage.Searchbar>
          <NovelSearch />
        </SearchPage.Searchbar>
        <div className="max-w-155">
          <div className="grid grid-cols-12 gap-2">
            <ProtectedLink
              permissionArgs={{
                resource: "novels",
                action: "create",
              }}
              to="/novels/create"
              className="full-button bg-secondary dark:bg-secondary-black dark:text-white col-span-full lg:col-span-4"
            >
              Create Novel
            </ProtectedLink>
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
      </SearchPage.Body>
    </SearchPage>
  );
}
