import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { GetFetchReturn } from "@/shared/types/service.types.ts";
import {
  AuthorThumbnailDTO,
  AuthorDetailDTO,
  AuthorSelectDTO,
} from "@repo/contracts/dto/author";
import { ZodType } from "zod";
import { buildAuthorsBaseQuery } from "./build-base-query.ts";
import {
  AuthorDetailSchema,
  AuthorThumbnailSchema,
} from "@repo/contracts/schemas/author";
import { AuthorWhere, authorWhereMap } from "./author.where.ts";

// Map's keys must follow AuthorSelectDTO
type AuthorDTOMap = {
  thumbnail: AuthorThumbnailDTO;
  detail: AuthorDetailDTO;
};

const getAuthorOneFactory = <T extends AuthorSelectDTO>({
  select,
  schema,
  where,
}: {
  select: T;
  schema: ZodType;
  where: AuthorWhere;
}) => {
  return async ({
    tx,
    id,
  }: {
    tx: DbExecTypes;
    id: Parameters<(typeof authorWhereMap)[AuthorWhere]>[0];
  }): Promise<GetFetchReturn<AuthorDTOMap, T> | null> => {
    const baseQuery = buildAuthorsBaseQuery({
      type: select,
      tx,
    });
    const result = await baseQuery.where(authorWhereMap[where](id));
    if (!result[0]) return null;
    return schema.encode(result[0]) as GetFetchReturn<AuthorDTOMap, T>;
  };
};

export const getAuthorThumbnailByIdTx = getAuthorOneFactory({
  select: "thumbnail",
  schema: AuthorThumbnailSchema,
  where: "id",
});

export const getAuthorDetailByIdTx = getAuthorOneFactory({
  select: "detail",
  schema: AuthorDetailSchema,
  where: "id",
});

export const getAuthorByNameTx = getAuthorOneFactory({
  select: "detail",
  schema: AuthorDetailSchema,
  where: "name",
});
