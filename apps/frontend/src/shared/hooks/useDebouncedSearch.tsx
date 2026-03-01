import type { UseNavigateResult } from "@tanstack/react-router";
import type { AppRoutePaths } from "../components/DropdownSelects/DropdownSelect";
import { useDebouncedCallback } from "use-debounce";

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
