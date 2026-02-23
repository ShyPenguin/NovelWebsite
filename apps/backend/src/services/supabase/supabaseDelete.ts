import { supabase } from "@/db/supabase/index.ts";

export async function deleteImageFromSupabase(path: string) {
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_PUBLIC_BUCKET!)
    .remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}
