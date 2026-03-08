import {
  ChapterListDTO,
  ChapterThumbnailDTO,
} from "@repo/contracts/dto/chapter";
import { ZodType } from "zod";
import { CHAPTER_PAGE_SIZE } from "@repo/contracts/constants";
import {
  ArrayChapterThumbnailSchema,
  PaginatedChapterThumbnailSchema,
} from "@repo/contracts/schemas/chapter";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { db } from "@/infrastructure/db/index.ts";
import { NotFoundError } from "@/shared/errors/index.ts";
import { getNovelAuthByIdTx } from "@/features/novels/repositories/get-novel-one.ts";
import {
  GetListParams,
  GetFetchListReturn,
  GetServiceList,
} from "@/shared/types/service.types.ts";
import {
  getChaptersTx,
  getPaginatedChaptersTx,
} from "../repositories/get-chapters.repository.ts";

type ChapterDTOMap = {
  [K in ChapterListDTO]: K extends "thumbnail" ? ChapterThumbnailDTO[] : never;
};

type BaseArgs = {
  id: string;
  query?: Record<string, any>;
  tx?: DbExecTypes;
};

export const getChapterServiceFactory = <
  T extends ChapterListDTO,
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
    GetFetchListReturn<ChapterDTOMap, T, P>
  > => {
    // SELECTING THE DATA  i.e. Thumbnail / Trend / Detail
    const finalizedQuery = {
      ...query,
      novelId: id,
    };
    const result = await tx.transaction(async (trx) => {
      const novel = await getNovelAuthByIdTx({ id }, trx);
      if (!novel) throw new NotFoundError("novels");

      if (!paginated) {
        // Return array
        const chapters = await getChaptersTx({
          tx,
          query: finalizedQuery,
          type,
        });
        const parsedChapter = schema.encode(chapters);
        return parsedChapter as GetFetchListReturn<ChapterDTOMap, T, P>;
      }
      // Return paginated
      const paginatedData = await getPaginatedChaptersTx({
        tx,
        query: finalizedQuery,
        type,
        page: page ? page : 1,
        pageSize: pageSize ? pageSize : CHAPTER_PAGE_SIZE,
      });

      const parsedPaginatedData = schema.encode(paginatedData);
      return parsedPaginatedData as GetFetchListReturn<ChapterDTOMap, T, P>;
    });

    return result;
  };
};

export const getNovelChaptersThumbnailService = getChapterServiceFactory({
  type: "thumbnail",
  paginated: false,
  schema: ArrayChapterThumbnailSchema,
});
export const getNovelChaptersThumbnailPaginatedService =
  getChapterServiceFactory({
    type: "thumbnail",
    paginated: true,
    schema: PaginatedChapterThumbnailSchema,
  });

export const GetNovelChaptersServices = {
  thumbnail: {
    list: getNovelChaptersThumbnailService,
    paginated: getNovelChaptersThumbnailPaginatedService,
  },
} satisfies GetServiceList<ChapterListDTO>;
