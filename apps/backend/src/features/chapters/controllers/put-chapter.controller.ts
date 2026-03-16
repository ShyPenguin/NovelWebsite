import { putControllerFactory } from "@/shared/factories/controller/put.controller.js";
import { updateChapterService } from "@/features/chapters/services/update-chapter.service.js";

export const putChapterController = putControllerFactory({
  service: updateChapterService,
});
