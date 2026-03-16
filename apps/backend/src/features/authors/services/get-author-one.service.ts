import { getResourceServiceFactory } from "@/shared/factories/service/get-resource-one.service.js";
import { getAuthorDetailByIdTx } from "../repositories/get-author-one.repository.js";

export const getAuthorOneService = getResourceServiceFactory({
  resource: "authors",
  repository: getAuthorDetailByIdTx,
});
