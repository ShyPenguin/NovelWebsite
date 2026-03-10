import type { UseNavigateResult } from "@tanstack/react-router";
import { useDebouncedCallback } from "use-debounce";
import type { AppRoutePaths } from "../components/DropdownButtons/RouteDropdown";

export function useDebouncedSearch<T>({
  navigate,
  time = 300,
}: {
  navigate: UseNavigateResult<AppRoutePaths>;
  time?: number;
}) {
  return useDebouncedCallback((query: Partial<T>) => {
    navigate({
      search: (prev: T) => ({
        ...prev,
        ...query,
      }),
      resetScroll: false,
    });
  }, time);
}
