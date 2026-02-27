import {
  NovelDetailDTO,
  NovelAuthDTO,
  NovelThumbnailDTO,
  NovelTrendDTO,
  NovelListDTO,
} from "@repo/contracts/dto/novel";
import { ZodType } from "zod";
import {
  ArrayNovelDetailSchema,
  ArrayNovelAuthSchema,
  ArrayNovelThumbnailSchema,
  ArrayNovelTrendSchema,
  PaginatedNovelDetailSchema,
  PaginatedNovelAuthSchema,
  PaginatedNovelThumbnailSchema,
  PaginatedNovelTrendSchema,
} from "@repo/contracts/schemas/novel";
import { PAGE_SIZE } from "@/shared/constants/index.ts";
import { db } from "@/infrastructure/db/index.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";

import { NovelQueryOutput } from "@/features/novels/novel.schema..ts";
import {
  GetListParams,
  GetFetchListReturn,
  GetServiceList,
} from "@/shared/types/service.types.ts";
import {
  getNovelsRepo,
  getPaginatedNovelsRepo,
} from "../repositories/get-novels.repository.ts";

type NovelDTOMap = {
  detail: NovelDetailDTO[];
  trend: NovelTrendDTO[];
  thumbnail: NovelThumbnailDTO[];
  auth: NovelAuthDTO[];
};

type BaseArgs = {
  query?: NovelQueryOutput;
  tx?: DbExecTypes;
};

export const getNovelsServiceFactory = <
  T extends NovelListDTO,
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
  return async (
    {
      query = { sort: "desc(title)", status: "ALL" },
      tx = db,
      page,
      pageSize,
    }: GetListParams<BaseArgs, P> = {} as GetListParams<BaseArgs, P>,
  ): Promise<GetFetchListReturn<NovelDTOMap, T, P>> => {
    if (!paginated) {
      // Return array
      const novels = await getNovelsRepo({ tx, query, type });
      const parsedNovel = schema.encode(novels);
      return parsedNovel as GetFetchListReturn<NovelDTOMap, T, P>;
    }
    // Return paginated
    const paginatedData = await getPaginatedNovelsRepo({
      tx: tx,
      query: query!,
      type,
      page: page ? page : 1,
      pageSize: pageSize ? pageSize : PAGE_SIZE,
    });

    const parsedPaginatedData = schema.encode(paginatedData);
    return parsedPaginatedData as GetFetchListReturn<NovelDTOMap, T, P>;
  };
};

// Thumbnails
export const getNovelsThumbnailService = getNovelsServiceFactory({
  type: "thumbnail",
  paginated: false,
  schema: ArrayNovelThumbnailSchema,
});
export const getNovelsThumbnailPaginatedService = getNovelsServiceFactory({
  type: "thumbnail",
  paginated: true,
  schema: PaginatedNovelThumbnailSchema,
});

// Trends
export const getNovelsTrendService = getNovelsServiceFactory({
  type: "trend",
  paginated: false,
  schema: ArrayNovelTrendSchema,
});
export const getNovelsTrendPaginatedService = getNovelsServiceFactory({
  type: "trend",
  paginated: true,
  schema: PaginatedNovelTrendSchema,
});

// Trends
export const getNovelsAuthService = getNovelsServiceFactory({
  type: "auth",
  paginated: false,
  schema: ArrayNovelAuthSchema,
});
export const getNovelsAuthPaginatedService = getNovelsServiceFactory({
  type: "auth",
  paginated: true,
  schema: PaginatedNovelAuthSchema,
});

// Details
export const getNovelsDetailService = getNovelsServiceFactory({
  type: "detail",
  paginated: false,
  schema: ArrayNovelDetailSchema,
});
export const getNovelsDetailPaginatedService = getNovelsServiceFactory({
  type: "detail",
  paginated: true,
  schema: PaginatedNovelDetailSchema,
});

export const GetNovelsServices = {
  detail: {
    list: getNovelsDetailService,
    paginated: getNovelsDetailPaginatedService,
  },
  thumbnail: {
    list: getNovelsThumbnailService,
    paginated: getNovelsThumbnailPaginatedService,
  },
  trend: {
    list: getNovelsTrendService,
    paginated: getNovelsTrendPaginatedService,
  },
  auth: {
    list: getNovelsAuthService,
    paginated: getNovelsAuthPaginatedService,
  },
} satisfies GetServiceList<NovelListDTO>;
