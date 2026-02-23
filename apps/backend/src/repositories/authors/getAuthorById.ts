import { DbExecTypes } from "@/db/type.ts";
import { GetFetchReturn } from "@/services/types/index.ts";
import { AuthorDTO, AuthorListDTO } from "@repo/contracts/dto/author";
import { ZodType } from "zod";
import { buildAuthorsBaseQuery } from "./buildBaseQuery.ts";
import { eq } from "drizzle-orm";
import { AuthorTable } from "@/db/schemas/authors.ts";
import { AuthorSchema } from "@repo/contracts/schemas/author";

type AuthorDTOMap = {
  detail: AuthorDTO;
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
    id: AuthorDTO["id"];
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

export const getAuthorByIdTx = getAuthorByIdFactory({
  type: "detail",
  schema: AuthorSchema,
});
