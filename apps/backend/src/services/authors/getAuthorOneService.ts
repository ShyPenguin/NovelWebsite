import { getAuthorByIdTx } from "@/repositories/authors/getAuthorById.ts";
import { getResourceByIdServiceFactory } from "../factories/get-resource-by-id.ts";

export const getAuthorOneService = getResourceByIdServiceFactory({
  resource: "authors",
  repository: getAuthorByIdTx,
});
