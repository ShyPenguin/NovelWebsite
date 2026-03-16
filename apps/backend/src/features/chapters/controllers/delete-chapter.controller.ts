import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.js";
import { deleteChapterService } from "@/features/chapters/services/delete-chapter.service.js";

export const deleteChapterController = deleteControllerFactory({
  service: deleteChapterService,
});
