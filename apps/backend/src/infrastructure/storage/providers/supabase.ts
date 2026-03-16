import { ValidationError } from "@/shared/errors/index.js";
import { StorageProvider } from "../storage.type.js";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class SupabaseStorageProvider implements StorageProvider {
  private client: SupabaseClient;
  private bucket = process.env.PUBLIC_BUCKET!;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async upload(file: Express.Multer.File, path: string) {
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new ValidationError(error.message);
    }

    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);

    return {
      path,
      url: data.publicUrl,
    };
  }

  async delete(path: string) {
    const { error } = await this.client.storage
      .from(this.bucket)
      .remove([path]);

    if (error) {
      throw new Error(error.message);
    }
  }
}

export const createSupabaseStorage = (): StorageProvider => {
  const client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  return new SupabaseStorageProvider(client);
};
