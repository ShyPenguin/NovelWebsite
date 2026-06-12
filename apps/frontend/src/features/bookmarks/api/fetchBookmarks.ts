import { ApiResponseSchema } from "@repo/contracts/api";
import type { BookmarkDetailDTO } from "@repo/contracts/dto/bookmark";
import type {
  BookmarkResponseMap,
  FetchBookmarksReturn,
} from "../bookmark.type";
import type { FetchType, Paginated } from "@/shared/types";
import type { FullResponseMap } from "@/shared/types/responseTypes";
import {
  ArrayBookmarkDetailSchema,
  PaginatedBookmarkDetailSchema,
} from "@repo/contracts/schemas/bookmark";
import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import type { ZodType } from "zod";
import type { BookmarkSearchType } from "../bookmark.schema";
import { bookmarkUrlApi } from "../bookmark.constant";

export const fetchBookmarks = <
  T extends keyof FullResponseMap<BookmarkResponseMap>,
  P extends boolean,
>({
  type,
  paginated,
  schema,
}: {
  type: T;
  paginated: P;
  schema: ZodType;
}) => {
  void type;
  return async function (
    params: FetchType<BookmarkSearchType>,
  ): Promise<FetchBookmarksReturn<T>> {
    let url = `${bookmarkUrlApi}`;

    if (params.withQuery) {
      const { search, page } = params.data;

      if (search) {
        url += `?search=${search}`;
      }
      if (page && paginated) {
        url += `${search ? "&" : "?"}page=${page}`;
      }
    }

    const response = await fetch(url, {
      credentials: "include",
    });
    const result = await response.json();
    const parsedResult = ApiResponseSchema(schema).parse(result);
    if (!parsedResult.ok) {
      throw new Error(parsedResult.error.message);
    }
    return parsedResult.data as FetchBookmarksReturn<T>;
  };
};

const fetchBookmarksDetail = fetchBookmarks({
  type: "detail",
  paginated: false,
  schema: ArrayBookmarkDetailSchema,
});

const fetchBookmarkDetailPaginated = fetchBookmarks({
  type: "paginated.detail",
  paginated: true,
  schema: PaginatedBookmarkDetailSchema,
});

export const bookmarksQueryOption = () =>
  queryOptions<BookmarkDetailDTO[]>({
    queryKey: ["bookmarks"],
    queryFn: () => fetchBookmarksDetail({ withQuery: false }),
    staleTime: 6 * 60 * 60 * 1000, // 6 hour
    retry: import.meta.env.MODE == "dev",
  });

export const bookmarksPaginatedQueryOption = ({
  search,
  page,
}: BookmarkSearchType) =>
  queryOptions({
    queryKey: ["bookmarks", { search, page }],
    queryFn: () =>
      fetchBookmarkDetailPaginated({
        withQuery: true,
        data: { search, page },
      }),
    staleTime: 6 * 60 * 60 * 1000, // 6 hour
    retry: import.meta.env.MODE == "dev",
  });

export const bookmarksInfiniteQueryOption = ({
  search,
}: Omit<BookmarkSearchType, "page">) =>
  infiniteQueryOptions<Paginated<BookmarkDetailDTO[]>>({
    queryKey: ["bookmarks", "infinite", search],
    queryFn: async ({ pageParam = 1 }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return await fetchBookmarkDetailPaginated({
        withQuery: true,
        data: { search: search, page: page },
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.items) return undefined;

      const currentPage = allPages.length;
      const totalPages = lastPage.totalPage || 0;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    retry: import.meta.env.MODE == "dev",
  });
