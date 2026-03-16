import { getResourceServiceFactory } from "@/shared/factories/service/get-resource-one.service.js";
import { getNovelDetailByIdTx } from "../repositories/get-novel-one.js";

export const getNovelByIdService = getResourceServiceFactory({
  resource: "novels",
  repository: getNovelDetailByIdTx,
});
