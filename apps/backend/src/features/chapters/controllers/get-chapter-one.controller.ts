import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.ts";
import { getChapterOneService } from "@/features/chapters/services/get-chapter-one.service.ts";
import { ChapterDetailEncodeDTO } from "@repo/contracts/dto/chapter";

export const getChapterOneController = getOneControllerFactory<
  { id: string },
  ChapterDetailEncodeDTO
>({
  service: getChapterOneService,
});
