import { getOneControllerFactory } from "@/shared/factories/controller/get-one.controller.ts";
import { getChapterOneService } from "@/features/chapters/services/get-chapter-one.service.ts";

export const getChapterOneController = getOneControllerFactory({
  service: getChapterOneService,
});
