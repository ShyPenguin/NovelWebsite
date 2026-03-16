import { Cookies } from "@/shared/types/index.js";
import { Request, Response } from "express";
import {
  COOKIE_SESSION_KEY,
  SESSION_EXPIRATION_SECONDS,
} from "../constants/index.js";

export function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}

export const defaultCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
};

export function createCookieWrapper(req: Request, res: Response): Cookies {
  return {
    get: (key) => {
      const value = req.cookies[key];
      return value ? { name: key, value } : undefined;
    },
    set: (key, value, options) => {
      const expires = options.expires ? new Date(options.expires) : undefined;
      res.cookie(key, value, {
        httpOnly: options.httpOnly,
        secure: options.secure,
        sameSite: options.sameSite,
        expires,
      });
    },
    delete: (key) => {
      res.clearCookie(key, defaultCookieOptions);
    },
  };
}
