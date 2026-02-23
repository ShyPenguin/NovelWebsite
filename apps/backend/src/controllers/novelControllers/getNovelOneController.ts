import { getNovelByIdService } from "../../services/novels/getNovelByIdService.ts";
import { NovelDetailEncodeDTO } from "@repo/contracts/dto/novel";
import { getOneControllerFactory } from "../factories/get-one-controller.ts";

export const getNovelOneController =
  getOneControllerFactory<NovelDetailEncodeDTO>({
    service: getNovelByIdService,
  });
