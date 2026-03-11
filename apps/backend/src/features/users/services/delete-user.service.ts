import { UserTableSelect } from "@/infrastructure/db/schemas/index.ts";
import { UserThumbnailEncodeDTO } from "@repo/contracts/dto/user";
import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.ts";
import { getUserThumbnailByIdTx } from "../repositories/get-user-one.repository.ts";
import { deleteUserTx } from "../repositories/delete.repository.ts";

export const deleteUserService = deleteResourceServiceFactory<
  UserThumbnailEncodeDTO,
  "users",
  UserTableSelect
>({
  resource: "users",
  getResourceRepo: getUserThumbnailByIdTx,
  deleteResourceRepo: deleteUserTx,
});
