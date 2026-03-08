import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { GetFetchReturn } from "@/shared/types/service.types.ts";
import {
  UserThumbnailDTO,
  UserSelectDTO,
  UserDetailDTO,
} from "@repo/contracts/dto/user";
import { ZodType } from "zod";
import {
  UserDetailSchema,
  UserThumbnailSchema,
} from "@repo/contracts/schemas/user";
import { buildUsersBaseQuery } from "./user.build-base-query.ts";
import { UserWhere, userWhereMap } from "./user.where.ts";

// Map's keys must follow UserSelectDTO
type UserDTOMap = {
  thumbnail: UserThumbnailDTO;
  detail: UserDetailDTO;
};

type UserWhereParams<W extends UserWhere> = {
  [K in W]: Parameters<(typeof userWhereMap)[K]>[0];
};

const getUserOneFactory = <T extends UserSelectDTO, W extends UserWhere>({
  type,
  schema,
  where,
}: {
  type: T;
  schema: ZodType;
  where: W;
}) => {
  return async (
    params: UserWhereParams<W>,
    tx: DbExecTypes,
  ): Promise<GetFetchReturn<UserDTOMap, T> | null> => {
    const baseQuery = buildUsersBaseQuery({
      type,
      tx,
    });

    // extract the correct value dynamically
    const value = params[where];

    const result = await baseQuery.where(userWhereMap[where](value));

    if (!result[0]) return null;

    return schema.encode(result[0]) as GetFetchReturn<UserDTOMap, T>;
  };
};

export const getUserThumbnailByIdTx = getUserOneFactory({
  type: "thumbnail",
  schema: UserThumbnailSchema,
  where: "id",
});

export const getUserDetailByUsernameTx = getUserOneFactory({
  type: "detail",
  schema: UserDetailSchema,
  where: "username",
});
