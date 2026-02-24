import {
  COOKIE_SESSION_KEY,
  SESSION_EXPIRATION_SECONDS,
} from "@/constants/index.ts";
import { redisClient } from "@/db/redis/index.ts";
import { Cookies } from "@/types/index.ts";
import { setCookie } from "@/utils/cookiesFunction.ts";
import { SessionStore } from "tests/integrated/db/redis-test.ts";
import { getUserSessionById } from "./getUserSessionById.ts";

export const updateUserSessionExpiration = async (
  cookies: Pick<Cookies, "get" | "set">,
  redis: typeof redisClient | SessionStore = redisClient,
) => {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  const user = await getUserSessionById(sessionId);
  if (user == null) return;

  await redis.set(`session:${sessionId}`, user, {
    ex: SESSION_EXPIRATION_SECONDS,
  });
  setCookie(sessionId, cookies);
};
