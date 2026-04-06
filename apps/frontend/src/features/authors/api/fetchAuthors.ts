import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { ZodType } from "zod";
import {
  ArrayAuthorThumbnailSchema,
  PaginatedAuthorThumbnailSchema,
} from "@repo/contracts/schemas/author";
import { ApiResponseSchema } from "@repo/contracts/api";
import type { AuthorThumbnailDTO } from "@repo/contracts/dto/author";
import type { AuthorSearchType } from "@/features/authors/author.schema";
import type {
  AuthorResponseMap,
  FetchAuthorsReturn,
} from "@/features/authors/author.type";
import { urlApiRoute } from "../author.constant";
import type { FetchType, Paginated } from "@/shared/types";
import type { FullResponseMap } from "@/shared/types/responseTypes";
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
}) => {
  void type;
  return async function (
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

    const response = await fetch(url, {
      credentials: "include",
    });
    const result = await response.json();
    const parsedResult = ApiResponseSchema(schema).parse(result);
    if (!parsedResult.ok) {
      throw new Error(parsedResult.error.message);
    }
    return parsedResult.data as FetchAuthorsReturn<T>;
  };
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
    retry: import.meta.env.MODE == "dev",
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
    retry: import.meta.env.MODE == "dev",
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
    retry: import.meta.env.MODE == "dev",
  });
