import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.js";
import { getAuthorThumbnailByIdTx } from "../repositories/get-author-one.repository.js";
import { deleteAuthorTx } from "../repositories/delete.repository.js";

export const deleteAuthorService = deleteResourceServiceFactory({
  resource: "authors",
  getResourceRepo: getAuthorThumbnailByIdTx,
  deleteResourceRepo: deleteAuthorTx,
});
