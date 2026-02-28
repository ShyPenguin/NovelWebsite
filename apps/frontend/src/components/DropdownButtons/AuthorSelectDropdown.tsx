import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { authorsInfiniteQueryOption } from "../../features/authors/api/fetchAuthors";
import { DropdownSearchWrapper } from "./DropdownSearchWrapper";

export function AuthorSelectDropDown({
  value,
  onChange,
  defaultValueName,
  className,
  errorMessage,
}: {
  value: string;
  onChange: (id: string) => void;
  defaultValueName: string;
  className?: string;
  errorMessage?: string;
}) {
  const [query, setQuery] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(authorsInfiniteQueryOption({ search: query }));

  const options = useMemo(() => {
    return (
      data?.pages.flatMap((p) =>
        p.items.map((a) => ({
          value: a.id,
          label: a.name,
        })),
      ) ?? []
    );
  }, [data]);

  const selectedOption = options.find((o) => o.value === value) ?? {
    value,
    label: defaultValueName,
  };

  const handleOnChange = (option: typeof selectedOption) => {
    setQuery("");
    onChange(option.value);
  };
  return (
    <DropdownSearchWrapper
      options={options}
      selectedOption={selectedOption}
      onChange={handleOnChange}
      setSearch={setQuery}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      className={className}
      errorMessage={errorMessage}
    />
  );
}
