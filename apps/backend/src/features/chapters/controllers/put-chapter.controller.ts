import { putControllerFactory } from "@/shared/factories/controller/put.controller.ts";
import { updateChapterService } from "@/features/chapters/services/update-chapter.service.ts";

export const putChapterController = putControllerFactory({
  service: updateChapterService,
});
