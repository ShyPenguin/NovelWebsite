import { queryOptions } from "@tanstack/react-query";
import type { ChapterResponseMap, FetchChaptersReturn } from "../chapter.type";
import { BackendApiLink } from "../../../shared/constants";
import type {
  ChapterSearchType,
  NovelChapterSearchType,
} from "../chapter.schema";
import type { ZodType } from "zod";
import {
  ArrayChapterThumbnailSchema,
  PaginatedChapterThumbnailSchema,
} from "@repo/contracts/schemas/chapter";
import { ApiResponseSchema } from "@repo/contracts/api";
import type { ChapterThumbnailDTO } from "@repo/contracts/dto/chapter";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { getNovelChaptersQueryKey } from "@/features/chapters/utils/chapter.tanstack-keys";
import type { FetchType, Paginated } from "@/shared/types";
import type { FullResponseMap } from "@/shared/types/responseTypes";

const urlRoute = "chapters";

export const fetchNovelChapters = <
  T extends keyof FullResponseMap<ChapterResponseMap>,
>({
  type,
  schema,
}: {
  type: T;
  schema: ZodType;
}) => {
  return async ({
    params,
    novelId,
  }: {
    params: FetchType<ChapterSearchType>;
    novelId: NovelDetailDTO["id"];
  }): FetchChaptersReturn<T> => {
    let url = `${BackendApiLink}/novels/${novelId}/${urlRoute}`;

    if (params.withQuery) {
      const { search, sort, page } = params.data;

      url += `?sort=${sort}(chapterNumber)`;

      if (search) {
        url += `&search=${search}`;
      }
      if (page) {
        url += `&page=${page}`;
      }
    }

    const response = await fetch(url);
    const result = await response.json();
    const parsedData = ApiResponseSchema(schema).parse(result);

    if (!parsedData.ok) {
      throw new Error(parsedData.error.message);
    }

    return parsedData.data as FetchChaptersReturn<T>;
  };
};

// It's not used but might be used in the future
// const fetchNovelChaptersAll = fetchNovelChapters({
//   type: "detail", schema:
// });

const fetchNovelChaptersThumbnail = fetchNovelChapters({
  type: "thumbnail",
  schema: ArrayChapterThumbnailSchema,
});
const fetchNovelChaptersPaginatedThumbnail = fetchNovelChapters({
  type: "paginated.thumbnail",
  schema: PaginatedChapterThumbnailSchema,
});

export const novelChaptersPaginatedQueryOptions = ({
  novelId,
  page = 1,
  sort = "desc",
  search = "",
}: NovelChapterSearchType) =>
  queryOptions<Paginated<ChapterThumbnailDTO[]>>({
    queryKey: getNovelChaptersQueryKey({ id: novelId, page, sort, search }),
    queryFn: () =>
      fetchNovelChaptersPaginatedThumbnail({
        params: {
          withQuery: true,
          data: { page, sort, search },
        },
        novelId: novelId,
      }),
    staleTime: 6 * 60 * 60 * 1000, // Consider chapter list fresh for 6 hour
  });

export const novelChaptersQueryOptions = ({ novelId }: { novelId: string }) =>
  queryOptions<ChapterThumbnailDTO[]>({
    queryKey: ["chapters", novelId],
    queryFn: () =>
      fetchNovelChaptersThumbnail({ params: { withQuery: false }, novelId }),
    staleTime: 6 * 60 * 60 * 1000, // Consider chapter list fresh for 6 hour
  });
