import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { StorageProvider } from "../storage.type.js";

export class MinioStorageProvider implements StorageProvider {
  private bucket = process.env.PUBLIC_BUCKET!;
  private client: S3Client;

  constructor(client: S3Client) {
    this.client = client;
  }

  async upload(file: Express.Multer.File, path: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: path,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      path,
      url: `${process.env.STORAGE_PUBLIC_DOMAIN}/${this.bucket}/${path}`,
    };
  }

  async delete(path: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      }),
    );
  }
}

export const createMinioStorage = (): StorageProvider => {
  const client = new S3Client({
    region: "ap-southeast-1",
    endpoint: process.env.MINIO_ENDPOINT,
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY!,
      secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  return new MinioStorageProvider(client);
};
