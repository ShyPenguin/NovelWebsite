import { putControllerFactory } from "../factories/put-controller.ts";
import { updateChapterService } from "@/services/chapters/updateChapterService.ts";

export const putChapterController = putControllerFactory({
  service: updateChapterService,
});
