import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.js";
import { deleteBookmarkService } from "../services/delete-bookmark.service.js";

export const deleteBookmarkController = deleteControllerFactory({
  service: deleteBookmarkService,
});
