import { waitForDb } from "./wait-for-db.js";
import "dotenv/config";

const DATABASE_URL =
  process.env.NODE_ENV == "test"
    ? process.env.DATABASE_ADMIN_URL!
    : process.env.DATABASE_URL!;

console.log("at check db databaseURL: ", DATABASE_URL);
console.log("at check redis databaseURL: ", process.env.REDIS_URL);
console.log("at check minio databaseURL: ", process.env.MINIO_ENDPOINT);
waitForDb({
  databaseUrl: DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  minioUrl: process.env.MINIO_ENDPOINT,
});
