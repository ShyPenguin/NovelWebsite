import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.js";
import { deleteChapterTx } from "../repositories/delete.repository.js";
import { getChapterAuthByIdTx } from "../repositories/get-chapter-one.repository.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";

export const deleteChapterService = deleteResourceServiceFactory({
  resource: "chapters",

  getResourceRepo: getChapterAuthByIdTx,

  deleteResourceRepo: ({ tx, resource }) => {
    return deleteChapterTx({
      tx,
      id: resource.id,
    });
  },
});
