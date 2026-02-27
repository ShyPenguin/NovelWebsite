import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { ZodType } from "zod";
import {
  ArrayAuthorThumbnailSchema,
  PaginatedAuthorThumbnailSchema,
} from "@repo/contracts/schemas/author";
import { ApiResponseSchema } from "@repo/contracts/api";
import type { AuthorThumbnailDTO } from "@repo/contracts/dto/author";
import type { FullResponseMap } from "@/types/responseTypes";
import type { AuthorSearchType } from "@/schemas/authors";
import type { FetchType, Paginated } from "@/types";
import type { AuthorResponseMap, FetchAuthorsReturn } from "@/types/author";
import { urlApiRoute } from "../constant";
export const fetchAuthors = <
  T extends keyof FullResponseMap<AuthorResponseMap>,
  P extends boolean,
>({
  type,
  paginated,
  schema,
}: {
  type: T;
  paginated: P;
  schema: ZodType;
}) =>
  async function (
    params: FetchType<AuthorSearchType>,
  ): Promise<FetchAuthorsReturn<T>> {
    let url = `${urlApiRoute}`;

    if (params.withQuery) {
      const { search, page } = params.data;

      if (search) {
        url += `?search=${search}`;
      }
      if (page && paginated) {
        url += `${search ? "&" : "?"}page=${page}`;
      }
    }

    const response = await fetch(url);
    const result = await response.json();
    const parsedResult = ApiResponseSchema(schema).parse(result);
    if (!parsedResult.ok) {
      throw new Error(parsedResult.error.message);
    }
    return parsedResult.data as FetchAuthorsReturn<T>;
  };

const fetchAuthorsThumbnail = fetchAuthors({
  type: "thumbnail",
  paginated: false,
  schema: ArrayAuthorThumbnailSchema,
});

const fetchAuthorThumbnailPaginated = fetchAuthors({
  type: "paginated.thumbnail",
  paginated: true,
  schema: PaginatedAuthorThumbnailSchema,
});

export const authorsQueryOption = () =>
  queryOptions<AuthorThumbnailDTO[]>({
    queryKey: ["authors"],
    queryFn: () => fetchAuthorsThumbnail({ withQuery: false }),
    staleTime: 6 * 60 * 60 * 1000, // 6 hour
  });

export const authorsPaginatedQueryOption = ({
  search,
  page,
}: AuthorSearchType) =>
  queryOptions({
    queryKey: ["authors", { search, page }],
    queryFn: () =>
      fetchAuthorThumbnailPaginated({
        withQuery: true,
        data: { search, page },
      }),
    staleTime: 6 * 60 * 60 * 1000, // 6 hour
  });
export const authorsInfiniteQueryOption = ({
  search,
}: Omit<AuthorSearchType, "page">) =>
  infiniteQueryOptions<Paginated<AuthorThumbnailDTO[]>>({
    queryKey: ["authors", "infinite", search],
    queryFn: async ({ pageParam = 1 }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return await fetchAuthorThumbnailPaginated({
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
  });
