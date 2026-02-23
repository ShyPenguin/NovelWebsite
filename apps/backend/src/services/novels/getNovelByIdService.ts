import { getNovelDetailByIdTx } from "../../repositories/novels/getNovelById.ts";
import { getResourceByIdServiceFactory } from "../factories/get-resource-by-id.ts";

export const getNovelByIdService = getResourceByIdServiceFactory({
  resource: "novel",
  repository: getNovelDetailByIdTx,
});
