import { db } from "@/db/index.ts";
import { DbExecTypes } from "@/db/type.ts";
import { AuthorQueryOutput } from "@/validations/AuthorValidator.ts";
import { AuthorDTO, AuthorListDTO } from "@repo/contracts/dto/author";
import { ZodType } from "zod";
import {
  GetFetchListReturn,
  GetListParams,
  GetServiceList,
} from "../types/index.ts";
import {
  getAuthorsTx,
  getPaginatedAuthorsTx,
} from "@/repositories/authors/getAuthors.ts";
import { PAGE_SIZE, PAGE_SIZE_AUTHOR } from "@/constants/index.ts";
import {
  ArrayAuthorSchema,
  PaginatedAuthorSchema,
} from "@repo/contracts/schemas/author";

type AuthorDTOMap = {
  [K in AuthorListDTO]: K extends "detail" ? AuthorDTO[] : never;
};

type BaseArgs = {
  query?: AuthorQueryOutput;
  tx?: DbExecTypes;
};

export const getNovelsServiceFactory = <
  T extends AuthorListDTO,
  P extends boolean,
>({
  type,
  paginated,
  schema,
}: {
  type: T;
  paginated: P;
  schema: ZodType;
}) => {
  return async (
    {
      query = {},
      tx = db,
      page,
      pageSize,
    }: GetListParams<BaseArgs, P> = {} as GetListParams<BaseArgs, P>,
  ): Promise<GetFetchListReturn<AuthorDTOMap, T, P>> => {
    if (!paginated) {
      // Return array
      const novels = await getAuthorsTx({ tx, query, type });
      const parsedNovel = schema.encode(novels);
      return parsedNovel as GetFetchListReturn<AuthorDTOMap, T, P>;
    }
    // Return paginated
    const paginatedData = await getPaginatedAuthorsTx({
      tx: tx,
      query: query!,
      type,
      page: page ? page : 1,
      pageSize: pageSize ? pageSize : PAGE_SIZE_AUTHOR,
    });

    const parsedPaginatedData = schema.encode(paginatedData);
    return parsedPaginatedData as GetFetchListReturn<AuthorDTOMap, T, P>;
  };
};

// Details
export const getAuthorsService = getNovelsServiceFactory({
  type: "detail",
  paginated: false,
  schema: ArrayAuthorSchema,
});
export const getAuthorsPaginatedService = getNovelsServiceFactory({
  type: "detail",
  paginated: true,
  schema: PaginatedAuthorSchema,
});

export const GetAuthorsServices = {
  detail: {
    list: getAuthorsService,
    paginated: getAuthorsPaginatedService,
  },
} satisfies GetServiceList<AuthorListDTO>;
