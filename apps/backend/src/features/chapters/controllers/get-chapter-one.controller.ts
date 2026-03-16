import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.js";
import { getChapterOneService } from "@/features/chapters/services/get-chapter-one.service.js";
import { ChapterDetailEncodeDTO } from "@repo/contracts/dto/chapter";

export const getChapterOneController = getOneControllerFactory<
  { id: string },
  ChapterDetailEncodeDTO
>({
  service: getChapterOneService,
});
