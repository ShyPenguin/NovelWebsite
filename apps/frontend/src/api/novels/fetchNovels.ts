import { INTERVAL_24_HRS } from "../../constants";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type {
  FetchNovelsReturn,
  NovelThumbnail,
  NovelTrend,
  FetchType,
  NovelResponseMap,
  Paginated,
} from "../../types";
import { determineNovelRoute } from "../../utils";
import { novelUrl } from "./url";
import type { FullResponseMap } from "../../types/responseTypes";
import type {
  NovelSearchInput,
  NovelSearchPaginated,
  NovelSearchType,
} from "../../schemas/novels";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import type { ZodType } from "zod";
import {
  ArrayNovelDetailSchema,
  ArrayNovelThumbnailSchema,
  ArrayNovelTrendSchema,
  PaginatedNovelDetailSchema,
} from "@repo/contracts/schemas/novel";
import { ApiResponseSchema } from "@repo/contracts/api";

export const fetchNovels = <
  T extends keyof FullResponseMap<NovelResponseMap>,
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
    params: FetchType<P extends true ? NovelSearchPaginated : NovelSearchInput>,
  ): FetchNovelsReturn<T> {
    let url = `${novelUrl}/${determineNovelRoute(type)}`;

    if (params.withQuery) {
      const { search, sort, status } = params.data;

      url += `?sort=${sort}`;

      if (search) {
        url += `&title=${search}`;
      }

      if (status !== "ALL") {
        url += `&status=${status}`;
      }
    }

    if ("page" in params && paginated) {
      url += `&page=${params.page}`;
    }

    const response = await fetch(url);

    const result = await response.json();

    const parsedResult = ApiResponseSchema(schema).parse(result);

    if (!parsedResult.ok) {
      throw new Error(parsedResult.error.message);
    }

    return parsedResult.data as FetchNovelsReturn<T>;
  };

const fetchNovelList = fetchNovels({
  type: "all",
  paginated: false,
  schema: ArrayNovelDetailSchema,
});
const fetchNovelListThumbnails = fetchNovels({
  type: "thumbnails",
  paginated: false,
  schema: ArrayNovelThumbnailSchema,
});
const fetchNovelListTrends = fetchNovels({
  type: "trends",
  paginated: false,
  schema: ArrayNovelTrendSchema,
});
const fetchNovelPaginated = fetchNovels({
  type: "paginated.all",
  paginated: true,
  schema: PaginatedNovelDetailSchema,
});

export const novelListThumbnailsQuery = () =>
  queryOptions<NovelThumbnail[]>({
    queryKey: ["novels", "thumbnails"],
    queryFn: () => fetchNovelListThumbnails({ withQuery: false }),
    staleTime: INTERVAL_24_HRS,
  });

export const novelListTrendsQuery = () =>
  queryOptions<NovelTrend[]>({
    queryKey: ["novels", "trends"],
    queryFn: () => fetchNovelListTrends({ withQuery: false }),
    staleTime: INTERVAL_24_HRS,
  });

export const novelsAll = () =>
  queryOptions<NovelDetailDTO[]>({
    queryKey: ["novels"],
    queryFn: () => fetchNovelList({ withQuery: false }),
    staleTime: INTERVAL_24_HRS,
  });

export const novelsListQuery = ({ sort, status, search }: NovelSearchType) =>
  queryOptions<NovelDetailDTO[]>({
    queryKey: ["novels", sort, status, search],
    queryFn: () =>
      fetchNovelList({
        withQuery: true,
        data: { sort, status, search },
      }),
    staleTime: INTERVAL_24_HRS,
    placeholderData: keepPreviousData,
  });
export const novelsPaginatedQuery = ({
  page,
  sort,
  status,
  search,
}: NovelSearchPaginated) =>
  queryOptions<Paginated<NovelDetailDTO[]>>({
    queryKey: ["novels", page, sort, status, search],
    queryFn: () =>
      fetchNovelPaginated({
        withQuery: true,
        data: { page, sort, status, search },
      }),
    staleTime: INTERVAL_24_HRS,
    placeholderData: keepPreviousData,
  });
