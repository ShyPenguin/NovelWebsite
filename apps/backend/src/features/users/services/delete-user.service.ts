import { getUserThumbnailByIdTx } from "../repositories/get-user-one.repository.js";
import { deleteUserTx } from "../repositories/delete.repository.js";
import { deleteResourceWithAssetsServiceFactory } from "@/shared/factories/service/delete-resource-with-assets.service.js";

export const deleteUserService = deleteResourceWithAssetsServiceFactory({
  resource: "users",
  resourceAsset: "imagePath",
  getResourceRepo: getUserThumbnailByIdTx,
  deleteResourceRepo: deleteUserTx,
});
