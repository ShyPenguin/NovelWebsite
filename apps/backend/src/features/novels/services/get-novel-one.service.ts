import { getResourceServiceFactory } from "@/shared/factories/service/get-resource-one.service.ts";
import { getNovelDetailByIdTx } from "../repositories/get-novel-one.ts";

export const getNovelByIdService = getResourceServiceFactory({
  resource: "novels",
  repository: getNovelDetailByIdTx,
});
