import { randomUUID } from "crypto";
import { storage } from "../index.js";

export async function uploadImageToStorage(
  file: Express.Multer.File,
  bucketPath: string,
): Promise<{ path: string; url: string }> {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${randomUUID()}.${fileExt}`;
  const filePath = `${bucketPath}/${fileName}`;

  const { path, url } = await storage.upload(file, filePath);

  return {
    path: filePath,
    url: url,
  };
}
