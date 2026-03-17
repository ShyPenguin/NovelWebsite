import { Client } from "pg";
import { createClient } from "redis";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function waitForDb({
  databaseUrl,
  redisUrl,
  minioUrl,
}: {
  databaseUrl: string;
  redisUrl?: string;
  minioUrl?: string;
}) {
  const total = 60;

  // Track readiness separately
  let postgresReady = false;
  let redisReady = redisUrl ? false : true; // If no redisUrl needed, consider it ready
  let minioIsReady = minioUrl ? false : true;

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
          database: 0,
        });
        await redisClient.connect();
        await redisClient.ping(); // Test with a simple ping
        await redisClient.quit();
        redisReady = true;
        console.log("✅ Redis is ready");
      }

      if (minioUrl && !minioIsReady) {
        console.log("Testing MinIO connection...");
        const command = new ListBucketsCommand({});
        const minioClient = new S3Client({
          region: "ap-southeast-1",
          endpoint: process.env.MINIO_ENDPOINT,
          credentials: {
            accessKeyId: process.env.MINIO_ACCESS_KEY!,
            secretAccessKey: process.env.MINIO_SECRET_KEY!,
          },
          forcePathStyle: true,
        });
        await minioClient.send(command);

        // Try to list buckets - this will verify credentials and connectivity

        minioIsReady = true;
        console.log("✅ MinIO is ready");
      }
      // Only exit when databases are ready (or Redis/Minio  not needed)
      if (postgresReady && redisReady && minioIsReady) {
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
