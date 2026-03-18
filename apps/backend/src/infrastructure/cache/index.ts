import "dotenv/config";
import { Redis } from "@upstash/redis";
import { createRedisSessionStore } from "@/infrastructure/cache/redis-local.js";

export const redisClient =
  process.env.NODE_ENV == "stage"
    ? new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      })
    : await createRedisSessionStore();
