import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.js";
import { ChapterDetailEncodeDTO } from "@repo/contracts/dto/chapter";
import { getChapterOneByNumberService } from "../services/get-chapter-one-by-number.service.js";

export const getChapterOneByNumberController = getOneControllerFactory<
  { id: string; chapterNumber: number },
  ChapterDetailEncodeDTO
>({
  service: getChapterOneByNumberService,
});
