import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.ts";
import { deleteChapterService } from "@/features/chapters/services/delete-chapter.service.ts";

export const deleteChapterController = deleteControllerFactory({
  service: deleteChapterService,
});
