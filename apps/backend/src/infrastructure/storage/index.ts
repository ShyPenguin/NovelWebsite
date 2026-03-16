import { createMinioStorage } from "./providers/minio.js";
import { createSupabaseStorage } from "./providers/supabase.js";
import { StorageProvider } from "./storage.type.js";
import "dotenv/config";

function createStorageProvider(): StorageProvider {
  const driver = process.env.STORAGE_DRIVER;
  switch (driver) {
    case "minio":
      return createMinioStorage();

    case "supabase":
      return createSupabaseStorage();

    default:
      throw new Error(`Unsupported storage driver: ${driver}`);
  }
}

export const storage = createStorageProvider();
