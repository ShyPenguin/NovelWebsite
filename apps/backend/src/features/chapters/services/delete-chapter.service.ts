import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.ts";
import { deleteChapterTx } from "../repositories/delete.repository.ts";
import { getChapterAuthByIdTx } from "../repositories/get-chapter-one.repository.ts";

export const deleteChapterService = deleteResourceServiceFactory({
  resource: "chapters",
  getResourceRepo: getChapterAuthByIdTx,
  deleteResourceRepo: deleteChapterTx,
});
