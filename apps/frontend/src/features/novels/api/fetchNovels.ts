import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type {
  NovelDetailDTO,
  NovelThumbnailDTO,
  NovelTrendDTO,
} from "@repo/contracts/dto/novel";
import type { ZodType } from "zod";
import {
  ArrayNovelDetailSchema,
  ArrayNovelThumbnailSchema,
  ArrayNovelTrendSchema,
  PaginatedNovelDetailSchema,
} from "@repo/contracts/schemas/novel";
import { ApiResponseSchema } from "@repo/contracts/api";
import { INTERVAL_24_HRS } from "@/shared/constants";
import type {
  NovelSearchPaginated,
  NovelSearchInput,
  NovelSearchType,
} from "@/features/novels/novel.schema";
import { determineNovelRoute } from "@/shared/utils";
import { novelUrl } from "./url";
import type { FetchType, Paginated } from "@/shared/types";
import type { FullResponseMap } from "@/shared/types/responseTypes";
import type { NovelResponseMap, FetchNovelsReturn } from "../novel.type";

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
  schema: ZodType<FetchNovelsReturn<T>>;
}) =>
  async function (
    params: FetchType<P extends true ? NovelSearchPaginated : NovelSearchInput>,
  ): Promise<FetchNovelsReturn<T>> {
    let url = `${novelUrl}/${determineNovelRoute(type)}`;

    if (params.withQuery) {
      const { search, sort, status } = params.data;

      url += `?sort=${sort}`;

      if (search) {
        url += `&search=${search}`;
      }

      if (status !== "ALL") {
        url += `&status=${status}`;
      }
      if ("page" in params.data && paginated) {
        url += `&page=${params.data.page}`;
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

    return parsedResult.data;
  };

const fetchNovelList = fetchNovels({
  type: "detail",
  paginated: false,
  schema: ArrayNovelDetailSchema,
});
const fetchNovelListThumbnails = fetchNovels({
  type: "thumbnail",
  paginated: false,
  schema: ArrayNovelThumbnailSchema,
});
const fetchNovelListTrends = fetchNovels({
  type: "trend",
  paginated: false,
  schema: ArrayNovelTrendSchema,
});
const fetchNovelPaginated = fetchNovels({
  type: "paginated.detail",
  paginated: true,
  schema: PaginatedNovelDetailSchema,
});

export const novelListThumbnailsQuery = () =>
  queryOptions<NovelThumbnailDTO[]>({
    queryKey: ["novels", "thumbnail"],
    queryFn: () => fetchNovelListThumbnails({ withQuery: false }),
    staleTime: INTERVAL_24_HRS,
    retry: import.meta.env.MODE == "dev",
  });

export const novelListTrendsQuery = () =>
  queryOptions<NovelTrendDTO[]>({
    queryKey: ["novels", "trend"],
    queryFn: () => fetchNovelListTrends({ withQuery: false }),
    staleTime: INTERVAL_24_HRS,
    retry: import.meta.env.MODE == "dev",
  });

export const novelsDetail = () =>
  queryOptions<NovelDetailDTO[]>({
    queryKey: ["novels"],
    queryFn: () => fetchNovelList({ withQuery: false }),
    staleTime: INTERVAL_24_HRS,
    retry: import.meta.env.MODE == "dev",
  });

export const novelsListQuery = ({ sort, status, search }: NovelSearchType) =>
  queryOptions<NovelDetailDTO[]>({
    queryKey: ["novels", { sort, status, search }],
    queryFn: () =>
      fetchNovelList({
        withQuery: true,
        data: { sort, status, search },
      }),
    staleTime: INTERVAL_24_HRS,
    placeholderData: keepPreviousData,
    retry: import.meta.env.MODE == "dev",
  });
export const novelsPaginatedQuery = ({
  page,
  sort,
  status,
  search,
}: NovelSearchPaginated) =>
  queryOptions<Paginated<NovelDetailDTO[]>>({
    queryKey: ["novels", { page, sort, status, search }],
    queryFn: () =>
      fetchNovelPaginated({
        withQuery: true,
        data: { page, sort, status, search },
      }),
    staleTime: INTERVAL_24_HRS,
    placeholderData: keepPreviousData,
    retry: import.meta.env.MODE == "dev",
  });
