import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { BackendApiLink } from "../../constants";
import type { FetchType } from "../../types";
import type { AuthorResponseMap, FetchAuthorsReturn } from "../../types/author";
import { type Paginated } from "../../types";
import type { z, ZodType } from "zod";
import {
  ArrayAuthorSchema,
  PaginatedAuthorSchema,
} from "@repo/contracts/schemas/author";
import { ApiResponseSchema } from "@repo/contracts/api";
import type { AuthorDTO } from "@repo/contracts/dto/author";
import type { FullResponseMap } from "@/types/responseTypes";
import type { AuthorSearchType } from "@/schemas/authors";
const urlRoute = "authors";

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
    let url = `${BackendApiLink}/${urlRoute}`;

    if (params.withQuery) {
      const { search, page } = params.data;

      if (search) {
        url += `?search=${search}`;

        console.log(params.data);
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

const fetchAuthorsAll = fetchAuthors({
  type: "detail",
  paginated: false,
  schema: ArrayAuthorSchema,
});

const fetchAuthorAllPaginated = fetchAuthors({
  type: "paginated.detail",
  paginated: true,
  schema: PaginatedAuthorSchema,
});

export const authorsQueryOptions = () =>
  queryOptions<AuthorDTO[]>({
    queryKey: ["authors"],
    queryFn: () => fetchAuthorsAll({ withQuery: false }),
    staleTime: 6 * 60 * 60 * 1000, // Consider chapter list fresh for 6 hour
  });

export const authorsInfiniteQueryOption = ({
  search,
}: Omit<AuthorSearchType, "page">) =>
  infiniteQueryOptions<Paginated<AuthorDTO[]>>({
    queryKey: ["authors", "infinite", search],
    queryFn: async ({ pageParam = 1 }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return await fetchAuthorAllPaginated({
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
