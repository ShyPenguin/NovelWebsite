import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { GetFetchReturn } from "@/shared/types/service.types.ts";
import {
  AuthorThumbnailDTO,
  AuthorDetailDTO,
  AuthorSelectDTO,
} from "@repo/contracts/dto/author";
import { ZodType } from "zod";
import { buildAuthorsBaseQuery } from "./author.build-base-query.ts";
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

type AuthorWhereParams<W extends AuthorWhere> = {
  [K in W]: Parameters<(typeof authorWhereMap)[K]>[0];
};

const getAuthorOneFactory = <
  T extends AuthorSelectDTO,
  Where extends AuthorWhere,
>({
  select,
  schema,
  where,
}: {
  select: T;
  schema: ZodType;
  where: Where;
}) => {
  return async (
    params: AuthorWhereParams<Where>,
    tx: DbExecTypes,
  ): Promise<GetFetchReturn<AuthorDTOMap, T> | null> => {
    const baseQuery = buildAuthorsBaseQuery({
      type: select,
      tx,
    });
    const value = params[where];

    const result = await baseQuery.where(authorWhereMap[where](value));
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
