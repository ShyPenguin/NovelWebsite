import { useCallback, useRef, type Dispatch, type SetStateAction } from "react";
import type { DropdownOption, DropdownProps } from "../../types";
import { DropdownBase } from "./DropdownBase";
import { useDebouncedCallback } from "use-debounce";

type InfiniteProps<T extends DropdownOption> = Pick<
  DropdownProps<T>,
  "options" | "selectedOption" | "label" | "onChange" | "errorMessage"
> & {
  setSearch: Dispatch<SetStateAction<string>>;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
};

export const DropdownSearchWrapper = <T extends DropdownOption>({
  options,
  selectedOption,
  label,
  onChange,
  setSearch,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  className,
  errorMessage,
}: InfiniteProps<T> & { className?: string }) => {
  const handleSearch = useDebouncedCallback((query) => {
    setSearch(query);
  }, 300);

  const inputRef = useRef<HTMLInputElement>(null);

  const inputLabelNode = (
    <input
      ref={inputRef}
      className="w-full focus:outline-none"
      placeholder="Select author"
      defaultValue={selectedOption.label}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );

  const fetchingNode = (
    <>{isFetchingNextPage && <div>Loading more data...</div>}</>
  );
  const intObserver = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (entry: HTMLLIElement | null) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (entry) intObserver.current.observe(entry);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  );

  const handleOnSelect = (option: typeof selectedOption) => {
    if (inputRef.current) {
      inputRef.current.value = option.label;
    }
    onChange(option);
  };
  return (
    <DropdownBase
      options={options}
      selectedOption={selectedOption}
      label={label}
      onChange={handleOnSelect}
      buttonLabelNode={inputLabelNode}
      infinite={true}
      fetchingNode={fetchingNode}
      lastItemRef={lastItemRef}
      className={className}
      errorMessage={errorMessage}
    />
  );
};
