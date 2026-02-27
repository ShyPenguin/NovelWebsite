import { getResourceByIdServiceFactory } from "@/shared/factories/service/get-resource-by-id.service.ts";
import { getAuthorDetailByIdTx } from "../repositories/get-author-by-id.repository.ts";

export const getAuthorOneService = getResourceByIdServiceFactory({
  resource: "authors",
  repository: getAuthorDetailByIdTx,
});
