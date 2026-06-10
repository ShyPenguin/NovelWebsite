import {
  ChapterDetailEncodeDTO,
  ChapterAuthDTO,
  ChapterSelectDTO,
  ChapterThumbnailDTO,
} from "@repo/contracts/dto/chapter";
import {
  ChapterDetailSchema,
  ChapterAuthSchema,
  ChapterThumbnailSchema,
} from "@repo/contracts/schemas/chapter";
import { ZodType } from "zod";
import { buildChaptersBaseQuery } from "./chapter.build-base-query.js";
import { GetFetchReturn } from "@/shared/types/service.types.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { chapterWhereMap, ChapterWhereMapType } from "./chapter.where.js";
import { SQL } from "drizzle-orm";

type ChapterDTOMap = {
  thumbnail: ChapterThumbnailDTO;
  detail: ChapterDetailEncodeDTO;
  auth: ChapterAuthDTO;
};

export const getChapterFactory = <
  T extends ChapterSelectDTO,
  W extends keyof ChapterWhereMapType,
>({
  type,
  schema,
  where,
}: {
  type: T;
  schema: ZodType;
  where: W;
}) => {
  return async (
    params: Parameters<ChapterWhereMapType[W]>[0],
    tx: DbExecTypes,
  ): Promise<GetFetchReturn<ChapterDTOMap, T> | null> => {
    const baseQuery = buildChaptersBaseQuery({
      type,
      tx,
    });

    const fn = chapterWhereMap[where] as (
      arg: Parameters<ChapterWhereMapType[W]>[0],
    ) => SQL<unknown> | undefined;

    const result = await baseQuery.where(fn(params));
    if (!result[0]) return null;
    return schema.encode(result[0]) as GetFetchReturn<ChapterDTOMap, T>;
  };
};

export const getChapterDetailByIdTx = getChapterFactory({
  type: "detail",
  schema: ChapterDetailSchema,
  where: "id",
});

export const getChapterDetailByNumberTx = getChapterFactory({
  type: "detail",
  schema: ChapterDetailSchema,
  where: "number",
});

export const getChapterAuthByIdTx = getChapterFactory({
  type: "auth",
  schema: ChapterAuthSchema,
  where: "id",
});

export const getChapterThumbnailByIdTx = getChapterFactory({
  type: "thumbnail",
  schema: ChapterThumbnailSchema,
  where: "id",
});
