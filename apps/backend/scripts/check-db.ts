import { waitForDb } from "./wait-for-db";
import "dotenv/config";

const DATABASE_URL =
  process.env.NODE_ENV == "test"
    ? process.env.DATABASE_ADMIN_URL!
    : process.env.DATABASE_URL!;

console.log("at check db databaseURL: ", DATABASE_URL);
waitForDb({ databaseUrl: DATABASE_URL });
