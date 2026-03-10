import { getRouteApi } from "@tanstack/react-router";
import { useDebouncedSearch } from "../../../shared/hooks/useDebouncedSearch";
import type { UserSearchPaginated } from "../user.schema";

const UserSearch = () => {
  const route = getRouteApi("/users/");
  const navigate = route.useNavigate();
  const { search } = route.useSearch();

  const debouncedSearch = useDebouncedSearch<UserSearchPaginated>({
    navigate,
    time: 300,
  });
  return (
    <input
      className="search text-base placeholder:text-base"
      placeholder="Search a user by their name, username, email..."
      onChange={(e) => debouncedSearch({ search: e.target.value })}
      defaultValue={search}
    />
  );
};

export default UserSearch;
