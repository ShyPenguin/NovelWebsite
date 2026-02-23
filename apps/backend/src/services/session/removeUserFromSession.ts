import { SessionStore } from "../../../tests/integrated/db/redis-test.ts";
import { COOKIE_SESSION_KEY } from "../../constants/index.ts";
import { redisClient } from "../../db/redis/index.ts";
import { Cookies } from "../../types/index.ts";

export const removeUserFromSession = async (
  cookies: Pick<Cookies, "get" | "delete">,
  redis: typeof redisClient | SessionStore = redisClient,
) => {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;
  cookies.delete(COOKIE_SESSION_KEY);
  await redis.del(`session:${sessionId}`);
};
