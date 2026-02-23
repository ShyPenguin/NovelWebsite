import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch";
import { DownArrow } from "../../assets/icons/Index";
import type { ChapterSearchType } from "../../schemas/chapters";

const ArrowButtons = ({ navigate }: { navigate: any }) => {
  const [desc, setDesc] = useState(true);

  return (
    <div className="flex gap-2 text-inherit border-inherit">
      <button
        className="arrow-button arrow-button-hover arrow-button-focus"
        data-state={!desc}
        onClick={() => {
          setDesc(false);
          navigate({
            search: (prev: ChapterSearchType) => ({ ...prev, sort: "asc" }),
            resetScroll: false,
          });
        }}
      >
        <DownArrow initialRotation="rotate-180" />
      </button>
      <button
        className="arrow-button arrow-button-hover arrow-button-focus"
        data-state={desc}
        onClick={() => {
          setDesc(true);

          navigate({
            search: (prev: ChapterSearchType) => ({ ...prev, sort: "desc" }),
            resetScroll: false,
          });
        }}
      >
        <DownArrow />
      </button>
    </div>
  );
};
const ChapterSearchBar = () => {
  const route = getRouteApi("/novels_/$novelId/chapters/");
  const navigate = route.useNavigate();
  const { search } = route.useSearch();

  const debouncedSearch = useDebouncedSearch<ChapterSearchType>({
    navigate,
    time: 500, // Longer debounce for search
  });

  return (
    <div className="flex w-full h-full gap-2 border-border dark:border-secondary-black">
      <input
        className="search"
        placeholder="Filter by chapter name, chapter title..."
        onChange={(e) => debouncedSearch({ search: e.target.value, page: 1 })}
        defaultValue={search}
      />
      <ArrowButtons navigate={navigate} />
    </div>
  );
};

export default ChapterSearchBar;
