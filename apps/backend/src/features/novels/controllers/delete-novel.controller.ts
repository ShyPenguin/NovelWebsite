import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.js";
import { deleteNovelService } from "../services/delete-novel.service.js";

export const deleteNovelController = deleteControllerFactory({
  service: deleteNovelService,
});
