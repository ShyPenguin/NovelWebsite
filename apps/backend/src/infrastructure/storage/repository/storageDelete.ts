import { storage } from "../index.js";

export async function deleteImageFromStore(path: string) {
  await storage.delete(path);
}
