import { deleteNovelTx } from "../repositories/delete.repository.ts";
import { getNovelAuthByIdTx } from "../repositories/get-novel-one.ts";
import { deleteResourceWithAssetsServiceFactory } from "@/shared/factories/service/delete-resource-with-assets.service.ts";

export const deleteNovelService = deleteResourceWithAssetsServiceFactory({
  resource: "novels",
  resourceAsset: "coverImagePath",
  getResourceRepo: getNovelAuthByIdTx,
  deleteResourceRepo: deleteNovelTx,
});
