import { deleteChapterTx } from "@/repositories/chapters/delete.ts";
import { deleteResourceServiceFactory } from "../factories/delete-resource.ts";
import { ChapterTableSelect } from "@/db/schemas/index.ts";
import { getChapterPosterByIdTx } from "@/repositories/chapters/getChapterById.ts";
import { ChapterPosterDTO } from "@repo/contracts/dto/chapter";

export const deleteChapterService = deleteResourceServiceFactory<
  ChapterPosterDTO,
  ChapterTableSelect
>({
  resource: "chapter",
  getOwner: (data: ChapterPosterDTO) => data.translator?.id,
  allowedRolesToSkip: ["admin"],
  getResourceRepo: getChapterPosterByIdTx,
  deleteResourceRepo: deleteChapterTx,
});
