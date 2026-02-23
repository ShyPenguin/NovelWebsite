import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/index.ts";
import { createCookieWrapper } from "../utils/cookiesFunction.ts";
import {
  getUserFromSession,
  updateUserSessionExpiration,
} from "../services/session/index.ts";
import { AuthenticationError } from "../utils/error.ts";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const cookie = createCookieWrapper(req, res);

  const user = await getUserFromSession(cookie);

  if (!user) {
    throw new AuthenticationError("User is not logged in");
  }

  await updateUserSessionExpiration(cookie);

  req.user = user;
  next();
};
