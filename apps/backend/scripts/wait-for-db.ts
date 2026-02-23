import { Client } from "pg";
import { createClient } from "redis";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function waitForDb({
  databaseUrl,
  redisUrl,
  workerId,
}: {
  databaseUrl: string;
  redisUrl?: string;
  workerId?: number;
}) {
  const total = 60;

  // Track readiness separately
  let postgresReady = false;
  let redisReady = redisUrl ? false : true; // If no redisUrl needed, consider it ready

  for (let i = 1; i <= total; i++) {
    try {
      // Check PostgreSQL if not ready yet
      if (!postgresReady) {
        const client = new Client({ connectionString: databaseUrl });
        await client.connect();
        await client.query("select 1");
        await client.end();
        postgresReady = true;
        console.log("✅ PostgreSQL is ready");
      }

      // Check Redis if not ready yet and URL provided
      if (redisUrl && !redisReady) {
        console.log("Testing Redis connection...");
        const redisClient = createClient({
          url: redisUrl,
          database: workerId,
        });
        await redisClient.connect();
        await redisClient.ping(); // Test with a simple ping
        await redisClient.quit();
        redisReady = true;
        console.log("✅ Redis is ready");
      }

      // Only exit when both are ready (or Redis not needed)
      if (postgresReady && redisReady) {
        console.log("✅ Both databases are ready");
        return;
      }
    } catch (err) {
      console.log(`⏳ Waiting for databases... (${i}/${total})`);
      console.log(`PostgreSQL: ${postgresReady ? "✅" : "❌"}`);
      console.log(`Redis: ${redisReady ? "✅" : "❌"}`);

      // if (err instanceof Error) {
      //   console.log(`Error: ${err.message}`);
      // }

      await sleep(1000);
    }
  }

  console.error("❌ Databases not ready after 60s");
  console.log(
    `Final status - PostgreSQL: ${postgresReady ? "✅" : "❌"}, Redis: ${redisReady ? "✅" : "❌"}`,
  );
  return;
}
