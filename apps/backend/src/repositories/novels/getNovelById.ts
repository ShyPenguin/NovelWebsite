import { eq } from "drizzle-orm";
import { NovelTable } from "../../db/schemas/index.ts";
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
import { DbExecTypes } from "../../db/type.ts";
import { ZodType } from "zod";
import { buildNovelsBaseQuery } from "./buildBaseQuery.ts";
import { GetFetchReturn } from "@/services/types/index.ts";

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
// export const getNovelDetailByIdTx = async ({
//   tx,
//   id,
// }: {
//   tx: DbExecTypes;
//   id: string;
// }): Promise<NovelDetailEncodeDTO | null> => {
//   const result = await tx
//     .select(novelSelectMap["detail"])
//     .from(NovelTable)
//     .leftJoin(AuthorTable, eq(NovelTable.authorId, AuthorTable.id))
//     .leftJoin(UserTable, eq(NovelTable.translatorId, UserTable.id))
//     .where(eq(NovelTable.id, id));

//   if (!result[0]) return null;
//   return NovelDetailSchema.encode(result[0]);
// };
