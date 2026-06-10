import { postControllerFactory } from "@/shared/factories/controller/post.controller.js";
import { createBookmarkService } from "../services/create-bookmark.service.js";
import { AuthRequest } from "@/shared/types/index.js";
import { Response } from "express";

export const postBookmarkController = postControllerFactory({
  service: async ({ user, parentId }) => {
    return createBookmarkService({
      form: { novelId: parentId },
      user,
    });
  },
});
