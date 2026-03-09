import { db } from "@/infrastructure/db/index.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import {
  UserQueryOutput,
  UserQuerySchema,
} from "@/features/users/user.schema.ts";
import { UserListDTO, UserThumbnailEncodeDTO } from "@repo/contracts/dto/user";
import { ZodType } from "zod";
import {
  ArrayUserThumbnailSchema,
  PaginatedUserThumbnailSchema,
} from "@repo/contracts/schemas/user";
import {
  GetFetchListReturn,
  GetListParams,
  GetServiceList,
} from "@/shared/types/service.types.ts";
import {
  getUsersTx,
  getPaginatedUsersTx,
} from "../repositories/get-users.repository.ts";
import { DEFAULT_PAGE_SIZE } from "@repo/contracts/constants";

type UserDTOMAP = {
  thumbnail: UserThumbnailEncodeDTO[];
};

type BaseArgs = {
  query?: UserQueryOutput;
  tx?: DbExecTypes;
};

export const getUsersServiceFactory = <
  T extends UserListDTO,
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
      query = UserQuerySchema.parse({}),
      tx = db,
      page,
      pageSize,
    }: GetListParams<BaseArgs, P> = {} as GetListParams<BaseArgs, P>,
  ): Promise<GetFetchListReturn<UserDTOMAP, T, P>> => {
    if (!paginated) {
      // Return array
      const users = await getUsersTx({ tx, query, type });
      const parsedNovel = schema.encode(users);
      return parsedNovel as GetFetchListReturn<UserDTOMAP, T, P>;
    }
    // Return paginated
    const paginatedData = await getPaginatedUsersTx({
      tx: tx,
      query: query!,
      type,
      page: page ? page : 1,
      pageSize: pageSize ? pageSize : DEFAULT_PAGE_SIZE,
    });

    const parsedPaginatedData = schema.encode(paginatedData);
    return parsedPaginatedData as GetFetchListReturn<UserDTOMAP, T, P>;
  };
};

// Thumbnails
export const getUsersThumbnailService = getUsersServiceFactory({
  type: "thumbnail",
  paginated: false,
  schema: ArrayUserThumbnailSchema,
});
export const getUsersThumbnailPaginatedService = getUsersServiceFactory({
  type: "thumbnail",
  paginated: true,
  schema: PaginatedUserThumbnailSchema,
});

export const GetUsersServices = {
  thumbnail: {
    list: getUsersThumbnailService,
    paginated: getUsersThumbnailPaginatedService,
  },
} satisfies GetServiceList<UserListDTO>;
