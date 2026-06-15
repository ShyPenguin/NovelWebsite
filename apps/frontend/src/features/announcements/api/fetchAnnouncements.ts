import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { ZodType } from "zod";
import {
  ArrayAnnouncementThumbnailSchema,
  PaginatedAnnouncementThumbnailSchema,
} from "@repo/contracts/schemas/announcement";
import { ApiResponseSchema } from "@repo/contracts/api";
import type { AnnouncementThumbnailDTO } from "@repo/contracts/dto/announcement";
import {
  ANNOUNCEMENT_SEARCH_DEFAULT,
  type AnnouncementSearchType,
} from "@/features/announcements/announcement.schema";
import type {
  AnnouncementResponseMap,
  FetchAnnouncementsReturn,
} from "@/features/announcements/announcement.type";
import { urlApiRoute } from "../announcement.constant";
import type { FetchType, Paginated } from "@/shared/types";
import type { FullResponseMap } from "@/shared/types/responseTypes";

export const fetchAnnouncements = <
  T extends keyof FullResponseMap<AnnouncementResponseMap>,
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
    params: FetchType<AnnouncementSearchType>,
  ): Promise<FetchAnnouncementsReturn<T>> {
    let url = `${urlApiRoute}`;

    if (params.withQuery) {
      const { search, page, pageSize } = params.data;

      if (search) {
        url += `?search=${search}`;
      }
      if (page && paginated) {
        url += `${search ? "&" : "?"}page=${page}&pageSize=${pageSize ?? ANNOUNCEMENT_SEARCH_DEFAULT.pageSize}`;
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
    return parsedResult.data as FetchAnnouncementsReturn<T>;
  };
};

const fetchAnnouncementsThumbnail = fetchAnnouncements({
  type: "thumbnail",
  paginated: false,
  schema: ArrayAnnouncementThumbnailSchema,
});

const fetchAnnouncementThumbnailPaginated = fetchAnnouncements({
  type: "paginated.thumbnail",
  paginated: true,
  schema: PaginatedAnnouncementThumbnailSchema,
});

export const announcementsQueryOption = () =>
  queryOptions<AnnouncementThumbnailDTO[]>({
    queryKey: ["announcements"],
    queryFn: () => fetchAnnouncementsThumbnail({ withQuery: false }),
    staleTime: 6 * 60 * 60 * 1000, // 6 hour
    retry: import.meta.env.MODE == "dev",
  });

export const announcementsPaginatedQueryOption = ({
  search,
  page,
  pageSize = ANNOUNCEMENT_SEARCH_DEFAULT.pageSize,
}: {
  search: AnnouncementSearchType["search"];
  page: AnnouncementSearchType["page"];
  pageSize?: AnnouncementSearchType["pageSize"];
}) =>
  queryOptions({
    queryKey: ["announcements", { search, page, pageSize }],
    queryFn: () =>
      fetchAnnouncementThumbnailPaginated({
        withQuery: true,
        data: { search, page, pageSize },
      }),
    staleTime: 6 * 60 * 60 * 1000, // 6 hour
    retry: import.meta.env.MODE == "dev",
  });
export const announcementsInfiniteQueryOption = ({
  search,
}: Omit<AnnouncementSearchType, "page">) =>
  infiniteQueryOptions<Paginated<AnnouncementThumbnailDTO[]>>({
    queryKey: ["announcements", "infinite", search],
    queryFn: async ({ pageParam = 1 }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      return await fetchAnnouncementThumbnailPaginated({
        withQuery: true,
        data: {
          search: search,
          page: page,
          pageSize: ANNOUNCEMENT_SEARCH_DEFAULT.pageSize,
        },
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
