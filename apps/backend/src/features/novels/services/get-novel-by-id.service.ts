import { getResourceByIdServiceFactory } from "@/shared/factories/service/get-resource-by-id.service.ts";
import { getNovelDetailByIdTx } from "../repositories/get-novel-by-id.repository.ts";

export const getNovelByIdService = getResourceByIdServiceFactory({
  resource: "novels",
  repository: getNovelDetailByIdTx,
});
