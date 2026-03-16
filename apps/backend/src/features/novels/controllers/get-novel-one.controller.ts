import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.js";
import { NovelDetailEncodeDTO } from "@repo/contracts/dto/novel";
import { getNovelByIdService } from "../services/get-novel-one.service.js";

export const getNovelOneController = getOneControllerFactory<
  { id: string },
  NovelDetailEncodeDTO
>({
  service: getNovelByIdService,
});
