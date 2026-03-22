import { sessionSchema } from "@repo/contracts/schemas/auth";
import { randomBytes } from "crypto";
import { UserSession } from "@repo/contracts/dto/auth";
import { redisClient } from "@/infrastructure/cache/index.js";
import {
  COOKIE_SESSION_KEY,
  REDIS_EXPIRATION,
} from "@/shared/constants/index.js";
import { setCookie } from "@/shared/utils/cookies-function.js";
import { Cookies } from "@/shared/types/index.js";
import { SessionStore } from "@/infrastructure/cache/redis-local.js";

export const createUserSession = async (
  user: UserSession,
  cookies: Pick<Cookies, "set">,
  redis: typeof redisClient | SessionStore = redisClient,
) => {
  const sessionId = randomBytes(512).toString("hex").normalize();
  await redis.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: REDIS_EXPIRATION,
  });

  setCookie(sessionId, cookies);
};

export const getUserFromSession = async (cookies: Pick<Cookies, "get">) => {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;
  return getUserSessionById(sessionId);
};

export const getUserSessionById = async (
  sessionId: string,
  redis: typeof redisClient | SessionStore = redisClient,
) => {
  const rawUser = await redis.get(`session:${sessionId}`);
  const { success, data: user } = sessionSchema.safeParse(rawUser);

  return success ? user : null;
};

export const removeUserFromSession = async (
  cookies: Pick<Cookies, "get" | "delete">,
  redis: typeof redisClient | SessionStore = redisClient,
) => {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;
  cookies.delete(COOKIE_SESSION_KEY);
  await redis.del(`session:${sessionId}`);
};

export const updateUserSessionData = async (
  user: UserSession,
  cookies: Pick<Cookies, "get">,
  redis: typeof redisClient | SessionStore = redisClient,
) => {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  await redis.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: REDIS_EXPIRATION,
  });
};

export const updateUserSessionExpiration = async (
  cookies: Pick<Cookies, "get" | "set">,
  redis: typeof redisClient | SessionStore = redisClient,
) => {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const user = await getUserSessionById(sessionId);
  if (!user) return null;

  await redis.set(`session:${sessionId}`, user, {
    ex: REDIS_EXPIRATION,
  });
  setCookie(sessionId, cookies);

  return user;
};
