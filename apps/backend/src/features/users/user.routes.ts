import { asyncHandler } from "@/shared/utils/async-handler.ts";
import { Router } from "express";
import { getUserOneController } from "./controllers/get-user-one.controller.ts";

const userRoutes = Router();

userRoutes.get("/:id", asyncHandler(getUserOneController));

export default userRoutes;
