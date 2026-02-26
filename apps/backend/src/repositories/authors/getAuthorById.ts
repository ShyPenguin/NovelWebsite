import { DbExecTypes } from "@/db/type.ts";
import { GetFetchReturn } from "@/services/types/index.ts";
import {
  AuthorThumbnailDTO,
  AuthorListDTO,
  AuthorDetailDTO,
} from "@repo/contracts/dto/author";
import { ZodType } from "zod";
import { buildAuthorsBaseQuery } from "./buildBaseQuery.ts";
import { eq } from "drizzle-orm";
import { AuthorTable } from "@/db/schemas/authors.ts";
import {
  AuthorDetailSchema,
  AuthorThumbnailSchema,
} from "@repo/contracts/schemas/author";

type AuthorDTOMap = {
  thumbnail: AuthorThumbnailDTO;
  detail: AuthorDetailDTO;
};

const getAuthorByIdFactory = <T extends AuthorListDTO>({
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
    id: AuthorThumbnailDTO["id"];
  }): Promise<GetFetchReturn<AuthorDTOMap, T> | null> => {
    const baseQuery = buildAuthorsBaseQuery({
      type,
      tx,
    });
    const result = await baseQuery.where(eq(AuthorTable.id, id));
    if (!result[0]) return null;
    return schema.encode(result[0]) as GetFetchReturn<AuthorDTOMap, T>;
  };
};

export const getAuthorThumbnailByIdTx = getAuthorByIdFactory({
  type: "thumbnail",
  schema: AuthorThumbnailSchema,
});

export const getAuthorDetailByIdTx = getAuthorByIdFactory({
  type: "detail",
  schema: AuthorDetailSchema,
});
