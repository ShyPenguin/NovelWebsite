import { getRouteApi } from "@tanstack/react-router";
import { useDebouncedSearch } from "../../../shared/hooks/useDebouncedSearch";
import type { NovelSearchType } from "../novel.schema";

const NovelSearch = () => {
  const route = getRouteApi("/novels/");
  const navigate = route.useNavigate();
  const { search } = route.useSearch();

  const debouncedSearch = useDebouncedSearch<NovelSearchType>({
    navigate,
    time: 300,
  });
  return (
    <input
      className="search text-base placeholder:text-base"
      placeholder="Search a series by title, alternative name, studio, author..."
      onChange={(e) => debouncedSearch({ search: e.target.value })}
      defaultValue={search}
    />
  );
};

export default NovelSearch;
