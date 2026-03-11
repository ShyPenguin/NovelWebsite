import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.ts";
import { deleteNovelTx } from "../repositories/delete.repository.ts";
import { getNovelAuthByIdTx } from "../repositories/get-novel-one.ts";

export const deleteNovelService = deleteResourceServiceFactory({
  resource: "novels",
  getResourceRepo: getNovelAuthByIdTx,
  deleteResourceRepo: deleteNovelTx,
});
