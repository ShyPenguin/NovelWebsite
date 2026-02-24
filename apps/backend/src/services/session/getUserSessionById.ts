import { sessionSchema } from "@repo/contracts/schemas/auth";
import { SessionStore } from "../../../tests/integrated/db/redis-test.ts";
import { redisClient } from "../../db/redis/index.ts";

export const getUserSessionById = async (
  sessionId: string,
  redis: typeof redisClient | SessionStore = redisClient,
) => {
  const rawUser = await redis.get(`session:${sessionId}`);
  const { success, data: user } = sessionSchema.safeParse(rawUser);

  return success ? user : null;
};
