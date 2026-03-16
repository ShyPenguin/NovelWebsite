import { db } from "@/infrastructure/db/index.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { AuthorQueryOutput } from "@/features/authors/author.schema.js";
import {
  AuthorThumbnailDTO,
  AuthorListDTO,
  AuthorDetailDTO,
} from "@repo/contracts/dto/author";
import { ZodType } from "zod";
import { PAGE_SIZE_AUTHOR } from "@/shared/constants/index.js";
import {
  ArrayAuthorDetailSchema,
  ArrayAuthorThumbnailSchema,
  PaginatedAuthorDetailSchema,
  PaginatedAuthorThumbnailSchema,
} from "@repo/contracts/schemas/author";
import {
  GetFetchListReturn,
  GetListParams,
  GetServiceList,
} from "@/shared/types/service.types.js";
import {
  getAuthorsTx,
  getPaginatedAuthorsTx,
} from "../repositories/get-authors.repository.js";

type AuthorDTOMAP = {
  detail: AuthorDetailDTO[];
  thumbnail: AuthorThumbnailDTO[];
};

type BaseArgs = {
  query?: AuthorQueryOutput;
  tx?: DbExecTypes;
};

export const getAuthorsServiceFactory = <
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
  ): Promise<GetFetchListReturn<AuthorDTOMAP, T, P>> => {
    if (!paginated) {
      // Return array
      const authors = await getAuthorsTx({ tx, query, type });
      const parsedNovel = schema.encode(authors);
      return parsedNovel as GetFetchListReturn<AuthorDTOMAP, T, P>;
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
    return parsedPaginatedData as GetFetchListReturn<AuthorDTOMAP, T, P>;
  };
};

// Thumbnails
export const getAuthorsThumbnailService = getAuthorsServiceFactory({
  type: "thumbnail",
  paginated: false,
  schema: ArrayAuthorThumbnailSchema,
});
export const getAuthorsThumbnailPaginatedService = getAuthorsServiceFactory({
  type: "thumbnail",
  paginated: true,
  schema: PaginatedAuthorThumbnailSchema,
});
// Details
export const getAuthorsDetailService = getAuthorsServiceFactory({
  type: "detail",
  paginated: false,
  schema: ArrayAuthorDetailSchema,
});
export const getAuthorsDetailPaginatedService = getAuthorsServiceFactory({
  type: "detail",
  paginated: true,
  schema: PaginatedAuthorDetailSchema,
});

export const GetAuthorsServices = {
  detail: {
    list: getAuthorsDetailService,
    paginated: getAuthorsDetailPaginatedService,
  },
  thumbnail: {
    list: getAuthorsThumbnailService,
    paginated: getAuthorsThumbnailPaginatedService,
  },
} satisfies GetServiceList<AuthorListDTO>;
