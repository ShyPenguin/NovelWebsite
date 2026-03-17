import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { NOVEL_URL_SUPABASE_PATH } from "@/shared/constants/index.js";

dotenv.config({ path: ".env.dev" });

const client = new S3Client({
  region: "ap-southeast-1",
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const bucket = process.env.PUBLIC_BUCKET!;
const seedDir = path.join(process.cwd(), "dev/seed/seed-images");
const policy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `arn:aws:s3:::${bucket}/*`,
    },
  ],
};

async function seedImages() {
  // check if bucket exists, if it doesnt then create
  try {
    await client.send(
      new HeadBucketCommand({
        Bucket: bucket,
      }),
    );
  } catch {
    await client.send(
      new CreateBucketCommand({
        Bucket: bucket,
      }),
    );
  }

  //Making it public read only
  const command = new PutBucketPolicyCommand({
    Bucket: bucket,
    Policy: JSON.stringify(policy),
  });
  await client.send(command);

  const files = fs.readdirSync(seedDir);

  for (const file of files) {
    const filePath = path.join(seedDir, file);
    const fileBuffer = fs.readFileSync(filePath);

    const key = `${NOVEL_URL_SUPABASE_PATH}/${file}`;

    // check if key exists, if it doesnt then create
    try {
      await client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );

      console.log(`Skipping existing: ${key}`);
    } catch {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: mime.lookup(file) || "application/octet-stream",
        }),
      );
      console.log(`Seeded: ${key}`);
    }
  }
}

seedImages().catch(console.error);
