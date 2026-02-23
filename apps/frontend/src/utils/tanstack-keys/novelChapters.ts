import type { ChapterSearchInput } from "@/schemas/chapters";
import type { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";

// id for novel's Id
export const getNovelChaptersQueryKey = ({
  id,
  page = 1,
  sort = "desc",
  search = "",
}: Omit<ChapterSearchInput, "page"> & {
  id: NovelDetailDTO["id"];
  page?: number;
}) => ["chapters", id, page, sort, search];

export const getChapterQueryKey = ({ id }: { id: ChapterDetailDTO["id"] }) => [
  "chapter",
  id,
];
