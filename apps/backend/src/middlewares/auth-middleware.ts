import { NextFunction, Response } from "express";
import { AuthRequest } from "../shared/types/index.js";
import { createCookieWrapper } from "@/shared/utils/cookies-function.js";
import { AuthenticationError } from "@/shared/errors/index.js";
import { updateUserSessionExpiration } from "@/features/auth/session.service.js";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const cookie = createCookieWrapper(req, res);

  const user = await updateUserSessionExpiration(cookie);

  if (!user) {
    throw new AuthenticationError("You're not logged in");
  }

  req.user = user;
  next();
};
