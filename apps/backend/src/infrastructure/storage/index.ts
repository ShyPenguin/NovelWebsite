import { createMinioStorage } from "./providers/minio.ts";
import { createSupabaseStorage } from "./providers/supabase.ts";
import { StorageProvider } from "./storage.type.ts";
import "dotenv/config";

function createStorageProvider(): StorageProvider {
  const driver = process.env.STORAGE_DRIVER;
  console.log(driver);
  console.log(process.env.NODE_ENV);
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
