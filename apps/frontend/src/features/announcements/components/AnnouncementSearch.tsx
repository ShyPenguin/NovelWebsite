import { useDebouncedSearch } from "@/shared/hooks/useDebouncedSearch";
import type { AnnouncementSearchType } from "@/features/announcements/announcement.schema";
import { getRouteApi } from "@tanstack/react-router";

const AnnouncementSearch = () => {
  const route = getRouteApi("/announcements/");
  const navigate = route.useNavigate();
  const { search } = route.useSearch();

  const debouncedSearch = useDebouncedSearch<AnnouncementSearchType>({
    navigate,
    time: 300,
  });
  return (
    <input
      className="search text-base placeholder:text-base"
      placeholder="Search announcement's titlle or content"
      onChange={(e) => debouncedSearch({ search: e.target.value })}
      defaultValue={search}
    />
  );
};

export default AnnouncementSearch;
