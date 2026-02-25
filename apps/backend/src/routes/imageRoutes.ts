import { Router } from "express";
import { upload } from "../middlewares/upload.ts";
import { postImageController } from "../controllers/imageControllers/postImageController.ts";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { idSchema } from "../validations/fields.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { authorizeRole } from "../middlewares/authorizeRole.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const imageRoutes = Router();

imageRoutes.post(
  "/",
  validateMiddleware(idSchema, "params"),
  upload.single("image"),
  asyncHandler(authMiddleware),
  authorizeRole(["admin", "staff"], "create", "images"),
  asyncHandler(postImageController),
);
export default imageRoutes;
