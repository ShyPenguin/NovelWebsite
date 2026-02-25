import { deleteChapterTx } from "@/repositories/chapters/delete.ts";
import { deleteResourceServiceFactory } from "../factories/delete-resource.ts";
import { ChapterTableSelect } from "@/db/schemas/index.ts";
import { getChapterPosterByIdTx } from "@/repositories/chapters/getChapterById.ts";
import { ChapterPosterDTO } from "@repo/contracts/dto/chapter";

export const deleteChapterService = deleteResourceServiceFactory<
  ChapterPosterDTO,
  "chapters",
  ChapterTableSelect
>({
  resource: "chapters",
  getResourceRepo: getChapterPosterByIdTx,
  deleteResourceRepo: deleteChapterTx,
});
