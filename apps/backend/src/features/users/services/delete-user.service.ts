import { getUserThumbnailByIdTx } from "../repositories/get-user-one.repository.ts";
import { deleteUserTx } from "../repositories/delete.repository.ts";
import { deleteResourceWithAssetsServiceFactory } from "@/shared/factories/service/delete-resource-with-assets.service.ts";

export const deleteUserService = deleteResourceWithAssetsServiceFactory({
  resource: "users",
  resourceAsset: "imagePath",
  getResourceRepo: getUserThumbnailByIdTx,
  deleteResourceRepo: deleteUserTx,
});
