import { Router } from "express";
import { validateMiddleware } from "../middlewares/validateMiddleware.ts";
import { idSchema } from "../validations/fields.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { authorizeRole } from "../middlewares/authorizeRole.ts";
import { permitMiddleware } from "../middlewares/permitMiddleware.ts";
import {
  getReviewOneController,
  putReviewController,
  deleteReviewController,
} from "../controllers/reviewControllers/index.ts";
import { ReviewUpdateFormSchema } from "../validations/ReviewValidator.ts";
import { getReviewOneService } from "../services/reviews/index.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const reviewRoutes = Router();

reviewRoutes.get(
  "/:id",
  validateMiddleware(idSchema, "params"),
  asyncHandler(getReviewOneController),
);

reviewRoutes.delete(
  "/:id",
  validateMiddleware(idSchema, "params"),
  authMiddleware,
  permitMiddleware({
    method: "delete",
    resource: "review",
    fetchResource: getReviewOneService,
    ownershipField: "reviewerId",
    allowedRolesToSkip: ["admin"],
    ownershipField2: "translatorId",
  }),
  asyncHandler(deleteReviewController),
);

reviewRoutes.put(
  "/:id",
  validateMiddleware(idSchema, "params"),
  validateMiddleware(ReviewUpdateFormSchema, "body"),
  authMiddleware,
  permitMiddleware({
    method: "update",
    resource: "review",
    fetchResource: getReviewOneService,
    ownershipField: "reviewerId",
    allowedRolesToSkip: [],
  }),
  asyncHandler(putReviewController),
);

export default reviewRoutes;
