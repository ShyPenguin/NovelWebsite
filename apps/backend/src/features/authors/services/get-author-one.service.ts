import { getResourceServiceFactory } from "@/shared/factories/service/get-resource-one.service.ts";
import { getAuthorDetailByIdTx } from "../repositories/get-author-one.repository.ts";

export const getAuthorOneService = getResourceServiceFactory({
  resource: "authors",
  repository: getAuthorDetailByIdTx,
});
