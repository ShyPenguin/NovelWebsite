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

const getUserByIdFactory = <T extends UserSelectDTO>({
  type,
  schema,
  where,
}: {
  type: T;
  schema: ZodType;
  where: UserWhere;
}) => {
  return async ({
    tx,
    id,
  }: {
    tx: DbExecTypes;
    id: UserThumbnailDTO["id"];
  }): Promise<GetFetchReturn<UserDTOMap, T> | null> => {
    const baseQuery = buildUsersBaseQuery({
      type,
      tx,
    });
    const result = await baseQuery.where(userWhereMap[where](id));
    if (!result[0]) return null;

    return schema.encode(result[0]) as GetFetchReturn<UserDTOMap, T>;
  };
};

export const getUserThumbnailByIdTx = getUserByIdFactory({
  type: "thumbnail",
  schema: UserThumbnailSchema,
  where: "id",
});

export const getUserDetailByUsernameTx = getUserByIdFactory({
  type: "detail",
  schema: UserDetailSchema,
  where: "username",
});
