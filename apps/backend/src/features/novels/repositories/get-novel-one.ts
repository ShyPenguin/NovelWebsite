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
import { buildNovelsBaseQuery } from "./build-base-query.ts";
import { GetFetchReturn } from "@/shared/types/service.types.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { NovelWhere, novelWhereMap } from "./novel.where.ts";

type NovelDTOMap = {
  detail: NovelDetailEncodeDTO;
  trend: NovelTrendDTO;
  thumbnail: NovelThumbnailDTO;
  auth: NovelAuthDTO;
};

type NovelWhereParams<W extends NovelWhere> = {
  [K in W]: Parameters<(typeof novelWhereMap)[K]>[0];
};

export const getNovelByIdFactory =
  <T extends keyof NovelDTOMap, Where extends NovelWhere>({
    type,
    schema,
    where,
  }: {
    type: T;
    schema: ZodType;
    where: Where;
  }) =>
  async (
    params: NovelWhereParams<Where>,
    tx: DbExecTypes,
  ): Promise<GetFetchReturn<NovelDTOMap, T> | null> => {
    const baseQuery = buildNovelsBaseQuery({
      type,
      tx,
    });

    const value = params[where];

    const result = await baseQuery.where(novelWhereMap[where](value));
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
