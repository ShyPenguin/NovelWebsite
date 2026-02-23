import { SessionStore } from "../../../tests/integrated/db/redis-test.ts";
import {
  COOKIE_SESSION_KEY,
  SESSION_EXPIRATION_SECONDS,
} from "../../constants/index.ts";
import { redisClient } from "../../db/redis/index.ts";
import { Cookies, sessionSchema, UserSession } from "../../types/index.ts";

export const updateUserSessionData = async (
  user: UserSession,
  cookies: Pick<Cookies, "get">,
  redis: typeof redisClient | SessionStore = redisClient,
) => {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  await redis.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  });
};
