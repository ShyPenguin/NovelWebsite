import { eq } from "drizzle-orm";
import {
  ChapterDetailDTO,
  ChapterDetailEncodeDTO,
  ChapterPosterDTO,
  ChapterSelectDTO,
  ChapterThumbnailDTO,
} from "@repo/contracts/dto/chapter";
import { DbExecTypes } from "../../db/type.ts";
import { chapterAlias } from "../../utils/databaseAlises.ts";
import { ChapterTable } from "../../db/schemas/index.ts";
import {
  ChapterDetailSchema,
  ChapterPosterSchema,
  ChapterThumbnailSchema,
} from "@repo/contracts/schemas/chapter";
import { ZodType } from "zod";
import { buildChaptersBaseQuery } from "./buildBaseQuery.ts";
import { GetFetchReturn } from "@/services/types/index.ts";

type ChapterDTOMap = {
  thumbnail: ChapterThumbnailDTO;
  detail: ChapterDetailEncodeDTO;
  poster: ChapterPosterDTO;
};

export const getChapterByIdFactory = <T extends ChapterSelectDTO>({
  type,
  schema,
}: {
  type: T;
  schema: ZodType;
}) => {
  return async ({
    tx,
    id,
  }: {
    tx: DbExecTypes;
    id: ChapterDetailDTO["id"];
  }): Promise<GetFetchReturn<ChapterDTOMap, T> | null> => {
    const baseQuery = buildChaptersBaseQuery({
      type,
      tx,
    });
    const result = await baseQuery.where(
      eq(type == "detail" ? chapterAlias.id : ChapterTable.id, id),
    );
    if (!result[0]) return null;
    return schema.encode(result[0]) as GetFetchReturn<ChapterDTOMap, T>;
  };
};

export const getChapterDetailByIdTx = getChapterByIdFactory({
  type: "detail",
  schema: ChapterDetailSchema,
});

export const getChapterPosterByIdTx = getChapterByIdFactory({
  type: "poster",
  schema: ChapterPosterSchema,
});

export const getChapterThumbnailByIdTx = getChapterByIdFactory({
  type: "thumbnail",
  schema: ChapterThumbnailSchema,
});
