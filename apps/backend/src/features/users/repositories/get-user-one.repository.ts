import { DbExecTypes } from "@/infrastructure/db/type.js";
import { GetFetchReturn } from "@/shared/types/service.types.js";
import {
  UserSelectDTO,
  UserThumbnailEncodeDTO,
  UserDetailEncodeDTO,
} from "@repo/contracts/dto/user";
import { ZodType } from "zod";
import {
  UserDetailSchema,
  UserThumbnailSchema,
} from "@repo/contracts/schemas/user";
import { buildUsersBaseQuery } from "./user.build-base-query.js";
import { UserWhere, userWhereMap } from "./user.where.js";

// Map's keys must follow UserSelectDTO
type UserDTOMap = {
  thumbnail: UserThumbnailEncodeDTO;
  detail: UserDetailEncodeDTO;
};

const getUserOneFactory = <T extends UserSelectDTO, W extends keyof UserWhere>({
  type,
  schema,
  where,
}: {
  type: T;
  schema: ZodType;
  where: W;
}) => {
  return async (
    params: Parameters<UserWhere[W]>[0],
    tx: DbExecTypes,
  ): Promise<GetFetchReturn<UserDTOMap, T> | null> => {
    const baseQuery = buildUsersBaseQuery({
      type,
      tx,
    });

    const fn = userWhereMap[where] as (arg: Parameters<UserWhere[W]>[0]) => any;

    const result = await baseQuery.where(fn(params));

    if (!result[0]) return null;

    return schema.encode(result[0]) as GetFetchReturn<UserDTOMap, T>;
  };
};

export const getUserThumbnailByIdTx = getUserOneFactory({
  type: "thumbnail",
  schema: UserThumbnailSchema,
  where: "id",
});

export const getUserDetailByIdTx = getUserOneFactory({
  type: "detail",
  schema: UserDetailSchema,
  where: "id",
});

export const getUserDetailByUsernameTx = getUserOneFactory({
  type: "detail",
  schema: UserDetailSchema,
  where: "username",
});
