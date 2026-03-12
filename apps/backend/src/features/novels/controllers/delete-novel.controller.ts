import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.ts";
import { deleteNovelService } from "../services/delete-novel.service.ts";

export const deleteNovelController = deleteControllerFactory({
  service: deleteNovelService,
});
