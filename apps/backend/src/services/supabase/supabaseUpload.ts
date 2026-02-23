import { randomUUID } from "crypto";
import { supabase } from "../../db/supabase/index.ts";
import { ValidationError } from "@/utils/error.ts";

export async function uploadImageToSupabase(
  file: Express.Multer.File,
): Promise<{ path: string; url: string }> {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${randomUUID()}.${fileExt}`;
  const filePath = `novels/covers/${fileName}`;

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_PUBLIC_BUCKET!)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new ValidationError(error.message);
  }

  const { data } = supabase.storage
    .from(process.env.SUPABASE_PUBLIC_BUCKET!)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    url: data.publicUrl,
  };
}
