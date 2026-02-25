import { deleteNovelTx } from "@/repositories/novels/delete.ts";
import { getNovelPosterByIdTx } from "@/repositories/novels/getNovelById.ts";
import { deleteResourceServiceFactory } from "../factories/delete-resource.ts";
import { NovelPosterDTO } from "@repo/contracts/dto/novel";
import { NovelTableSelect } from "@/db/schemas/index.ts";

export const deleteNovelService = deleteResourceServiceFactory<
  NovelPosterDTO,
  "novels",
  NovelTableSelect
>({
  resource: "novels",
  getResourceRepo: getNovelPosterByIdTx,
  deleteResourceRepo: deleteNovelTx,
});
