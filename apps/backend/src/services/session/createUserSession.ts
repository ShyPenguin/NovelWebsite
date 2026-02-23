import { SessionStore } from "../../../tests/integrated/db/redis-test.ts";
import { SESSION_EXPIRATION_SECONDS } from "../../constants/index.ts";
import { redisClient } from "../../db/redis/index.ts";
import { Cookies, sessionSchema, UserSession } from "../../types/index.ts";
import { setCookie } from "../../utils/cookiesFunction.ts";
import { randomBytes } from "crypto";

export const createUserSession = async (
  user: UserSession,
  cookies: Pick<Cookies, "set">,
  redis: typeof redisClient | SessionStore = redisClient,
) => {
  const sessionId = randomBytes(512).toString("hex").normalize();
  await redis.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  });

  setCookie(sessionId, cookies);
};
