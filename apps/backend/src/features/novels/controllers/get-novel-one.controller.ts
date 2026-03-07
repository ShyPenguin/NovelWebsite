import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.ts";
import { NovelDetailEncodeDTO } from "@repo/contracts/dto/novel";
import { getNovelByIdService } from "../services/get-novel-by-id.service.ts";

export const getNovelOneController = getOneControllerFactory<
  { id: string },
  NovelDetailEncodeDTO
>({
  service: getNovelByIdService,
});
