import { Redis } from "@upstash/redis";
import { createRedisSessionStore } from "../../../tests/integrated/db/redis-test.ts";

export const redisClient =
  process.env.NODE_ENV == "test"
    ? await createRedisSessionStore()
    : new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      });
