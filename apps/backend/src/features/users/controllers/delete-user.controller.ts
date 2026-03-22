import { deleteUserService } from "../services/delete-user.service.js";
import { AuthRequest } from "@/shared/types/index.js";
import { Response } from "express";
import { removeUserFromSession } from "@/features/auth/session.service.js";
import { createCookieWrapper } from "@/shared/utils/cookies-function.js";

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
