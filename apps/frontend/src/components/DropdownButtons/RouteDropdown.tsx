import { useNavigate } from "@tanstack/react-router";
import type { FileRoutesByFullPath } from "../../routeTree.gen";
import type { DropdownOption } from "../../types";
import DropdownSelect from "./DropdownSelect";

export type AppRoutePaths = keyof FileRoutesByFullPath;

export function RouteDropdown({
  options,
  selectedOption,
  label,
  filter,
  route,
  className,
}: {
  options: DropdownOption[];
  selectedOption: DropdownOption;
  label: string;
  filter: string;
  route: AppRoutePaths;
  className?: string;
}) {
  const navigate = useNavigate({ from: route });

  return (
    <DropdownSelect
      options={options}
      selectedOption={selectedOption}
      label={label}
      className={className}
      onChange={(option) =>
        navigate({
          search: (prev) => ({
            ...prev,
            [filter]: option.value,
          }),
        })
      }
    />
  );
}
