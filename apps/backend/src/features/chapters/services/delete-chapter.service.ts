import { ChapterTableSelect } from "@/infrastructure/db/schemas/index.ts";
import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.ts";
import { ChapterPosterDTO } from "@repo/contracts/dto/chapter";
import { deleteChapterTx } from "../repositories/delete.repository.ts";
import { getChapterPosterByIdTx } from "../repositories/get-chapter-by-id.repository.ts";

export const deleteChapterService = deleteResourceServiceFactory<
  ChapterPosterDTO,
  "chapters",
  ChapterTableSelect
>({
  resource: "chapters",
  getResourceRepo: getChapterPosterByIdTx,
  deleteResourceRepo: deleteChapterTx,
});
