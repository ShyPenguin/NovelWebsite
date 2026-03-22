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
import { ChapterWhere, chapterWhereMap } from "./chapter.where.js";

type ChapterDTOMap = {
  thumbnail: ChapterThumbnailDTO;
  detail: ChapterDetailEncodeDTO;
  auth: ChapterAuthDTO;
};

type ChapterWhereParams<W extends ChapterWhere> = {
  [K in W]: Parameters<(typeof chapterWhereMap)[K]>[0];
};

export const getChapterByIdFactory = <
  T extends ChapterSelectDTO,
  Where extends ChapterWhere,
>({
  type,
  schema,
  where,
}: {
  type: T;
  schema: ZodType;
  where: Where;
}) => {
  return async (
    params: ChapterWhereParams<Where>,
    tx: DbExecTypes,
  ): Promise<GetFetchReturn<ChapterDTOMap, T> | null> => {
    const baseQuery = buildChaptersBaseQuery({
      type,
      tx,
    });
    const value = params[where];

    const result = await baseQuery.where(chapterWhereMap[where](value));
    if (!result[0]) return null;
    return schema.encode(result[0]) as GetFetchReturn<ChapterDTOMap, T>;
  };
};

export const getChapterDetailByIdTx = getChapterByIdFactory({
  type: "detail",
  schema: ChapterDetailSchema,
  where: "id",
});

export const getChapterAuthByIdTx = getChapterByIdFactory({
  type: "auth",
  schema: ChapterAuthSchema,
  where: "id",
});

export const getChapterThumbnailByIdTx = getChapterByIdFactory({
  type: "thumbnail",
  schema: ChapterThumbnailSchema,
  where: "id",
});
