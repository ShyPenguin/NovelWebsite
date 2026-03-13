import { storage } from "../index.ts";

export async function deleteImageFromStore(path: string) {
  await storage.delete(path);
}
