import { deleteAuthorTx } from "@/repositories/authors/delete.ts";
import { deleteResourceServiceFactory } from "../factories/delete-resource.ts";
import { AuthorTableSelect } from "@/db/schemas/index.ts";
import { AuthorThumbnailDTO } from "@repo/contracts/dto/author";
import { getAuthorThumbnailByIdTx } from "@/repositories/authors/getAuthorById.ts";

export const deleteAuthorService = deleteResourceServiceFactory<
  AuthorThumbnailDTO,
  "authors",
  AuthorTableSelect
>({
  resource: "authors",
  getResourceRepo: getAuthorThumbnailByIdTx,
  deleteResourceRepo: deleteAuthorTx,
});
