import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import type { AuthorSearchType } from "@/schemas/authors";
import { getRouteApi } from "@tanstack/react-router";

const AuthorSearch = () => {
  const route = getRouteApi("/authors/");
  const navigate = route.useNavigate();
  const { search } = route.useSearch();

  const debouncedSearch = useDebouncedSearch<AuthorSearchType>({
    navigate,
    time: 300,
  });
  return (
    <input
      className="search text-base placeholder:text-base"
      placeholder="Search author's name"
      onChange={(e) => debouncedSearch({ search: e.target.value })}
      defaultValue={search}
    />
  );
};

export default AuthorSearch;
