import { MagnifyingGlass } from "../assets/icons/Index";
import { useDebouncedCallback } from "use-debounce";
import { forwardRef, Suspense, useRef, useState } from "react";
import { novelsListQuery } from "../api/novels/fetchNovels";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import useClickInsideOrOutside from "../hooks/useClickInsideOrOutside";
import { NO_IMAGE_URL } from "@/constants";

interface ContentProps {
  search: string;
  clearSearch: () => void;
}
const Content = forwardRef<HTMLUListElement, ContentProps>(
  ({ search, clearSearch }, ref) => {
    const { data: novels, isSuccess } = useSuspenseQuery(
      novelsListQuery({ search: search, status: "ALL", sort: "desc(title)" }),
    );

    return (
      <ul
        className="flex flex-col w-full max-h-78.75 overflow-y-auto p-5 gap-2 shadow-lg"
        ref={ref}
      >
        {isSuccess &&
          novels.length > 0 &&
          novels.map((novel) => (
            <li key={novel.id}>
              <Link
                className="flex gap-2"
                to="/novels/$novelId/chapters"
                params={{ novelId: novel.id }}
                search={{ page: 1, sort: "desc", search: "" }}
                onClick={() => clearSearch()}
                resetScroll={false}
              >
                <img
                  src={novel.coverImageUrl ?? NO_IMAGE_URL}
                  className="max-w-8 max-h-12 overflow-hidden rounded shrink-0"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-[14px]">{novel.title}</p>
                  <p className="text-[12px] text-muted-foreground dark:text-dark-muted-foreground">
                    {novel.totalChapters} chapters
                  </p>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    );
  },
);

export default function Searchbar() {
  const [search, setSearch] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const handleSearch = useDebouncedCallback((query) => {
    setSearch(query);
    setIsVisible(true);
  }, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setSearch("");
    setIsVisible(false);
  };

  const dropdownRef = useRef<HTMLUListElement>(null);

  useClickInsideOrOutside("OUTSIDE", dropdownRef, () => {
    setIsVisible(false);
  });

  useClickInsideOrOutside("INSIDE", inputRef, () => {
    setIsVisible(true);
  });

  return (
    <div className="flex w-full px-4 py-2 justify-start items-center gap-2  border-border border dark:border-secondary-black rounded-xl text-xs">
      <MagnifyingGlass className="w-4 h-4 center text-primary-black dark:text-primary-gray" />
      <input
        ref={inputRef}
        className="w-full focus:outline-none"
        placeholder="Search a series..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isVisible && search && (
        <div className="absolute w-full top-10 left-0 dark:bg-primary-black bg-white shadow-md rounded-md">
          <Suspense fallback={<Skeleton />}>
            <Content
              search={search}
              clearSearch={handleClear}
              ref={dropdownRef}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}

const Skeleton = () => {
  return (
    <div className="flex w-full h-21.5 p-5">
      <div className="size-full animate-pulse skeleton-color" />
    </div>
  );
};
