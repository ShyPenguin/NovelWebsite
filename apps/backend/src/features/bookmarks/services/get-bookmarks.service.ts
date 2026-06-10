import {
  BookmarkListDTO,
  BookmarkDetailDTO,
} from "@repo/contracts/dto/bookmark";
import { ZodType } from "zod";
import { DEFAULT_PAGE_SIZE } from "@repo/contracts/constants";
import {
  ArrayBookmarkDetailSchema,
  PaginatedBookmarkDetailSchema,
} from "@repo/contracts/schemas/bookmark";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { db } from "@/infrastructure/db/index.js";
import {
  GetListParams,
  GetFetchListReturn,
  GetServiceList,
} from "@/shared/types/service.types.js";
import {
  getBookmarksTx,
  getPaginatedBookmarksTx,
} from "../repositories/get-bookmarks.repository.js";

type BookmarkDTOMap = {
  [K in BookmarkListDTO]: K extends "detail" ? BookmarkDetailDTO[] : never;
};

type BaseArgs = {
  id: string;
  query?: Record<string, any>;
  tx?: DbExecTypes;
};

export const getBookmarkServiceFactory = <
  T extends BookmarkListDTO,
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
  return async ({
    id,
    query = {},
    tx = db,
    page,
    pageSize,
  }: GetListParams<BaseArgs, P>): Promise<
    GetFetchListReturn<BookmarkDTOMap, T, P>
  > => {
    const finalizedQuery = {
      ...query,
      userId: id,
    };

    const result = await tx.transaction(async (trx) => {
      if (!paginated) {
        // Return array
        const bookmarks = await getBookmarksTx({
          tx: trx,
          query: finalizedQuery,
          type,
        });
        const parsedBookmark = schema.encode(bookmarks);
        return parsedBookmark as GetFetchListReturn<BookmarkDTOMap, T, P>;
      }
      // Return paginated
      const paginatedData = await getPaginatedBookmarksTx({
        tx: trx,
        query: finalizedQuery,
        type,
        page: page ? page : 1,
        pageSize: pageSize ? pageSize : DEFAULT_PAGE_SIZE,
      });

      const parsedPaginatedData = schema.encode(paginatedData);
      return parsedPaginatedData as GetFetchListReturn<BookmarkDTOMap, T, P>;
    });

    return result;
  };
};

export const getBookmarksDetailService = getBookmarkServiceFactory({
  type: "detail",
  paginated: false,
  schema: ArrayBookmarkDetailSchema,
});
export const getBookmarksDetailPaginatedService = getBookmarkServiceFactory({
  type: "detail",
  paginated: true,
  schema: PaginatedBookmarkDetailSchema,
});

export const GetBookmarksServices = {
  detail: {
    list: getBookmarksDetailService,
    paginated: getBookmarksDetailPaginatedService,
  },
} satisfies GetServiceList<BookmarkListDTO>;
