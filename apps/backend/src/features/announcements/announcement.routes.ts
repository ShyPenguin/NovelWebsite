import { validateMiddleware } from "@/middlewares/validate-middleware.js";
import { Router } from "express";
import { AnnouncementQuerySchema } from "./announcement.schema.js";
import { asyncHandler } from "@/shared/utils/async-handler.js";
import { getAnnouncementsController } from "./controllers/get-announcements.controller.js";
import { idSchema } from "@repo/contracts/schemas/id";
import { getAnnouncementOneController } from "./controllers/get-announcement-one.controller.js";
import { AnnouncementFormSchema } from "@repo/contracts/schemas/announcement";
import { postAnnouncementController } from "./controllers/post-announcement.controller.js";
import { authMiddleware } from "@/middlewares/auth-middleware.js";
import { putAnnouncementController } from "./controllers/put-announcement.controller.js";
import { deleteAnnouncementController } from "./controllers/delete-author.controller.js";

const announcementRoutes = Router();

announcementRoutes.get(
  "/",
  validateMiddleware(AnnouncementQuerySchema, "query"),
  asyncHandler(getAnnouncementsController({ type: "thumbnail" })),
);

announcementRoutes.post(
  "/",
  asyncHandler(authMiddleware),
  validateMiddleware(AnnouncementFormSchema, "body"),
  asyncHandler(postAnnouncementController),
);

announcementRoutes.get(
  "/:id",
  validateMiddleware(idSchema, "params"),
  asyncHandler(getAnnouncementOneController),
);

announcementRoutes.put(
  "/:id",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  validateMiddleware(AnnouncementFormSchema, "body"),
  asyncHandler(putAnnouncementController),
);

announcementRoutes.delete(
  "/:id",
  asyncHandler(authMiddleware),
  validateMiddleware(idSchema, "params"),
  asyncHandler(deleteAnnouncementController),
);

export default announcementRoutes;
