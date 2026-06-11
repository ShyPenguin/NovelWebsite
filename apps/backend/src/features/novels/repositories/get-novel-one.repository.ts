import {
  NovelDetailEncodeDTO,
  NovelAuthDTO,
  NovelThumbnailDTO,
  NovelTrendDTO,
} from "@repo/contracts/dto/novel";
import {
  NovelDetailSchema,
  NovelAuthSchema,
} from "@repo/contracts/schemas/novel";
import { ZodType } from "zod";
import { buildNovelsBaseQuery } from "./novel.build-base-query.js";
import { GetFetchReturn } from "@/shared/types/service.types.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { NovelWhere, novelWhereMap } from "./novel.where.js";

type NovelDTOMap = {
  detail: NovelDetailEncodeDTO;
  trend: NovelTrendDTO;
  thumbnail: NovelThumbnailDTO;
  auth: NovelAuthDTO;
};

export const getNovelByIdFactory =
  <T extends keyof NovelDTOMap, W extends keyof NovelWhere>({
    type,
    schema,
    where,
  }: {
    type: T;
    schema: ZodType;
    where: W;
  }) =>
  async (
    params: Parameters<NovelWhere[W]>[0],
    tx: DbExecTypes,
    userId?: string,
  ): Promise<GetFetchReturn<NovelDTOMap, T> | null> => {
    let baseQuery;

    if (type == "detail") {
      baseQuery = buildNovelsBaseQuery({
        type,
        tx,
        userId,
      });
    } else {
      baseQuery = buildNovelsBaseQuery({
        type,
        tx,
      });
    }

    const fn = novelWhereMap[where] as (
      arg: Parameters<NovelWhere[W]>[0],
    ) => any;

    const result = await baseQuery.where(fn(params));
    if (!result[0]) return null;
    return schema.encode(result[0]) as GetFetchReturn<NovelDTOMap, T>;
  };

export const getNovelDetailByIdTx = getNovelByIdFactory({
  type: "detail",
  schema: NovelDetailSchema,
  where: "id",
});

export const getNovelAuthByIdTx = getNovelByIdFactory({
  type: "auth",
  schema: NovelAuthSchema,
  where: "id",
});
