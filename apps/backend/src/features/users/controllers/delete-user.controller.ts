import { deleteControllerFactory } from "@/shared/factories/controller/delete.controller.ts";
import { deleteUserService } from "../services/delete-user.service.ts";
import { AuthRequest } from "@/shared/types/index.ts";
import { Response } from "express";
import { removeUserFromSession } from "@/features/auth/session.service.ts";
import { createCookieWrapper } from "@/shared/utils/cookies-function.ts";

export const deleteUserController = async (req: AuthRequest, res: Response) => {
  const params = req.params;
  const result = await deleteUserService({
    id: Array.isArray(params.id) ? params.id[0] : params.id,
    user: req.user,
  });

  // Log them out if the user deletes itself
  if (req.user.id == result.id) {
    const cookie = createCookieWrapper(req, res);
    await removeUserFromSession(cookie);
  }
  return res.status(200).json({
    ok: true,
    data: result.id,
  });
};
