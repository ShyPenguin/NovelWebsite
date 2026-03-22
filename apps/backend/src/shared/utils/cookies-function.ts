import { Cookies } from "@/shared/types/index.js";
import { CookieOptions, Request, Response } from "express";
import {
  COOKIE_SESSION_KEY,
  SESSION_EXPIRATION_SECONDS,
} from "../constants/index.js";

const isProd = process.env.NODE_ENV !== "development";

export function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    maxAge: SESSION_EXPIRATION_SECONDS * 1000,
    path: "/",
    partitioned: true,
  });
}

export const defaultCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  partitioned: true,
} satisfies CookieOptions;

export function createCookieWrapper(req: Request, res: Response): Cookies {
  return {
    get: (key) => {
      const value = req.cookies[key];
      return value ? { name: key, value } : undefined;
    },
    set: (key, value, options) => {
      const maxAge = options.maxAge
        ? SESSION_EXPIRATION_SECONDS * 1000
        : undefined;
      res.cookie(key, value, {
        ...defaultCookieOptions,
        ...options,
        maxAge,
      });
    },
    delete: (key) => {
      res.clearCookie(key, defaultCookieOptions);
    },
  };
}
