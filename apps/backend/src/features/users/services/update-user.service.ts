import { db } from "@/infrastructure/db/index.ts";
import { DbClientType, DbPoolType } from "@/infrastructure/db/type.ts";
import {
  AuthorizationError,
  BaseError,
  CustomizedAuthorizationError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors/index.ts";
import { requirePermission } from "@/shared/utils/require-permission.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import {
  UserChangeRoleDTO,
  UserDetailDTO,
  UserFormDTO,
  UserThumbnailEncodeDTO,
} from "@repo/contracts/dto/user";
import { getUserThumbnailByIdTx } from "../repositories/get-user-one.repository.ts";
import { updateUserTx } from "../repositories/update.repository.ts";
import { UserThumbnailSchema } from "@repo/contracts/schemas/user";

export const updateUserService = async (
  {
    form,
    user,
    id,
  }: {
    form: UserFormDTO;
    user: UserSession;
    id: UserDetailDTO["id"];
  },
  tx: DbPoolType | DbClientType = db,
): Promise<UserThumbnailEncodeDTO> => {
  try {
    const result = await tx.transaction(async (trx) => {
      const userResource = await getUserThumbnailByIdTx({ id }, trx);
      if (!userResource) throw new NotFoundError("users");

      requirePermission({
        user,
        resource: "users",
        action: "update",
        ctx: {
          data: UserThumbnailSchema.decode(userResource),
        },
      });

      const updatedUser = await updateUserTx({
        tx: trx,
        form,
        id,
      });

      return UserThumbnailSchema.encode({
        ...userResource,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        name: updatedUser.name,
      });
    });

    return result;
  } catch (err: any) {
    if (err.code === "23505" && err.detail?.includes("name")) {
      throw new ValidationError("Name is already taken");
    }

    if (err.constructor.name == "NotFoundError")
      throw new NotFoundError("users");

    if (err.constructor.name == "AuthorizationError")
      throw new AuthorizationError({ action: "update", resource: "users" });

    throw new BaseError(500, "Internal Server Error");
  }
};
