import { waitForDb } from "./wait-for-db";
import dotenv from "dotenv";

dotenv.config({ path: ".env.stage" });
const url = new URL(process.env.DATABASE_URL!);
console.log({
  host: url.hostname,
  port: url.port,
  user: url.username,
});
console.log(process.env.DATABASE_URL);

waitForDb({
  databaseUrl: process.env.DATABASE_URL!,
});
