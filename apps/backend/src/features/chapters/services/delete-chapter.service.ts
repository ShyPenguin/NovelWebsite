import { ChapterTableSelect } from "@/infrastructure/db/schemas/index.ts";
import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.ts";
import { ChapterAuthDTO } from "@repo/contracts/dto/chapter";
import { deleteChapterTx } from "../repositories/delete.repository.ts";
import { getChapterAuthByIdTx } from "../repositories/get-chapter-one.repository.ts";

export const deleteChapterService = deleteResourceServiceFactory<
  ChapterAuthDTO,
  "chapters",
  ChapterTableSelect
>({
  resource: "chapters",
  getResourceRepo: getChapterAuthByIdTx,
  deleteResourceRepo: deleteChapterTx,
});
