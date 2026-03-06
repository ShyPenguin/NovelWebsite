import { NextFunction, Response } from "express";
import { AuthRequest } from "../shared/types/index.ts";
import { createCookieWrapper } from "@/shared/utils/cookies-function.ts";
import { AuthenticationError } from "@/shared/errors/index.ts";
import {
  getUserFromSession,
  updateUserSessionExpiration,
} from "@/features/auth/session.service.ts";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const cookie = createCookieWrapper(req, res);

  const user = await getUserFromSession(cookie);

  if (!user) {
    throw new AuthenticationError("You're not logged in");
  }

  await updateUserSessionExpiration(cookie);

  req.user = user;
  next();
};
