import { eq } from "drizzle-orm";
import {
  NovelDetailDTO,
  NovelDetailEncodeDTO,
  NovelPosterDTO,
  NovelThumbnailDTO,
  NovelTrendDTO,
} from "@repo/contracts/dto/novel";
import {
  NovelDetailSchema,
  NovelPosterSchema,
} from "@repo/contracts/schemas/novel";
import { ZodType } from "zod";
import { buildNovelsBaseQuery } from "./build-base-query.ts";
import { GetFetchReturn } from "@/shared/types/service.types.ts";
import { NovelTable } from "@/infrastructure/db/schemas/novels.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";

type NovelDTOMap = {
  detail: NovelDetailEncodeDTO;
  trend: NovelTrendDTO;
  thumbnail: NovelThumbnailDTO;
  poster: NovelPosterDTO;
};

export const getNovelByIdFactory =
  <T extends keyof NovelDTOMap>({
    type,
    schema,
  }: {
    type: T;
    schema: ZodType;
  }) =>
  async ({
    tx,
    id,
  }: {
    tx: DbExecTypes;
    id: NovelDetailDTO["id"];
  }): Promise<GetFetchReturn<NovelDTOMap, T> | null> => {
    const baseQuery = buildNovelsBaseQuery({
      type,
      tx,
    });
    const result = await baseQuery.where(eq(NovelTable.id, id));
    if (!result[0]) return null;
    return schema.encode(result[0]) as GetFetchReturn<NovelDTOMap, T>;
  };

export const getNovelDetailByIdTx = getNovelByIdFactory({
  type: "detail",
  schema: NovelDetailSchema,
});

export const getNovelPosterByIdTx = getNovelByIdFactory({
  type: "poster",
  schema: NovelPosterSchema,
});
