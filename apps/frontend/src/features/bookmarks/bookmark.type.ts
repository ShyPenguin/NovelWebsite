import type { FullResponseMap } from "@/shared/types/responseTypes";
import type { BookmarkDetailDTO } from "@repo/contracts/dto/bookmark";

export type BookmarkResponseMap = {
  detail: BookmarkDetailDTO[];
};

export type FetchBookmarksReturn<
  T extends keyof FullResponseMap<BookmarkResponseMap>,
> = FullResponseMap<BookmarkResponseMap>[T];
