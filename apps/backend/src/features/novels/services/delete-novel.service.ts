import { NovelPosterDTO } from "@repo/contracts/dto/novel";
import { NovelTableSelect } from "@/infrastructure/db/schemas/index.ts";
import { deleteResourceServiceFactory } from "@/shared/factories/service/delete-resource.service.ts";
import { deleteNovelTx } from "../repositories/delete.repository.ts";
import { getNovelPosterByIdTx } from "../repositories/get-novel-by-id.repository.ts";

export const deleteNovelService = deleteResourceServiceFactory<
  NovelPosterDTO,
  "novels",
  NovelTableSelect
>({
  resource: "novels",
  getResourceRepo: getNovelPosterByIdTx,
  deleteResourceRepo: deleteNovelTx,
});
