import { deleteControllerFactory } from "../factories/delete-controller.ts";
import { deleteChapterService } from "@/services/chapters/deleteChapterService.ts";

export const deleteChapterController = deleteControllerFactory({
  service: deleteChapterService,
});
