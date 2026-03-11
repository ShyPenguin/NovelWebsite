import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.ts";
import { getAuthorThumbnailByIdTx } from "../repositories/get-author-one.repository.ts";
import { deleteAuthorTx } from "../repositories/delete.repository.ts";

export const deleteAuthorService = deleteResourceServiceFactory({
  resource: "authors",
  getResourceRepo: getAuthorThumbnailByIdTx,
  deleteResourceRepo: deleteAuthorTx,
});
