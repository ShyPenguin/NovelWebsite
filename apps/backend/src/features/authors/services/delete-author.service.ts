import { AuthorTableSelect } from "@/infrastructure/db/schemas/index.ts";
import { AuthorThumbnailDTO } from "@repo/contracts/dto/author";
import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.ts";
import { getAuthorThumbnailByIdTx } from "../repositories/get-author-by-id.repository.ts";
import { deleteAuthorTx } from "../repositories/delete.repository.ts";

export const deleteAuthorService = deleteResourceServiceFactory<
  AuthorThumbnailDTO,
  "authors",
  AuthorTableSelect
>({
  resource: "authors",
  getResourceRepo: getAuthorThumbnailByIdTx,
  deleteResourceRepo: deleteAuthorTx,
});
