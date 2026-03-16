import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.js";
import { deleteChapterTx } from "../repositories/delete.repository.js";
import { getChapterAuthByIdTx } from "../repositories/get-chapter-one.repository.js";

export const deleteChapterService = deleteResourceServiceFactory({
  resource: "chapters",
  getResourceRepo: getChapterAuthByIdTx,
  deleteResourceRepo: deleteChapterTx,
});
