import { deleteNovelTx } from "../repositories/delete.repository.js";
import { getNovelAuthByIdTx } from "../repositories/get-novel-one.repository.js";
import { deleteResourceWithAssetsServiceFactory } from "@/shared/factories/service/delete-resource-with-assets.service.js";

export const deleteNovelService = deleteResourceWithAssetsServiceFactory({
  resource: "novels",
  resourceAsset: "coverImagePath",
  getResourceRepo: getNovelAuthByIdTx,
  deleteResourceRepo: ({ tx, resource }) => {
    return deleteNovelTx({
      tx,
      id: resource.id,
    });
  },
});
