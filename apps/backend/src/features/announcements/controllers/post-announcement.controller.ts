import { postControllerFactory } from "@/shared/factories/controller/post.controller.js";
import { createAnnouncementService } from "../services/create-announcement.service.js";

export const postAnnouncementController = postControllerFactory({
  service: createAnnouncementService,
});
