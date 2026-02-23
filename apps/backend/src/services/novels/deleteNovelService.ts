import { deleteNovelTx } from "@/repositories/novels/delete.ts";
import { getNovelPosterByIdTx } from "@/repositories/novels/getNovelById.ts";
import { deleteResourceServiceFactory } from "../factories/delete-resource.ts";
import { NovelPosterDTO } from "@repo/contracts/dto/novel";
import { NovelTableSelect } from "@/db/schemas/index.ts";

export const deleteNovelService = deleteResourceServiceFactory<
  NovelPosterDTO,
  NovelTableSelect
>({
  resource: "novel",
  getOwner: (data: NovelPosterDTO) => data.translator?.id,
  allowedRolesToSkip: ["admin"],
  getResourceRepo: getNovelPosterByIdTx,
  deleteResourceRepo: deleteNovelTx,
});
