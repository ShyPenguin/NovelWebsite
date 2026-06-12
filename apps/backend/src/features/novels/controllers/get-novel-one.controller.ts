import { updateUserSessionExpiration } from "@/features/auth/session.service.js";
import { getNovelByIdService } from "../services/get-novel-one.service.js";
import { AuthRequest } from "@/shared/types/index.js";
import { createCookieWrapper } from "@/shared/utils/cookies-function.js";
import { Response } from "express";

export const getNovelOneController = async (
  req: AuthRequest,
  res: Response,
) => {
  console.log("at get novel one controller");
  const cookie = createCookieWrapper(req, res);

  const user = await updateUserSessionExpiration(cookie);

  if (user) {
    req.user = user;
  }

  console.log(user);
  const result = await getNovelByIdService(
    { id: Array.isArray(req.params.id) ? req.params.id[0] : req.params.id },
    req.user,
  );

  console.log(result);
  return res.status(200).json({
    ok: true,
    data: result,
  });
};
