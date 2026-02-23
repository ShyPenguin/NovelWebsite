import { uploadImageToSupabase } from "../../services/supabase/supabaseUpload.ts";
import { AuthRequest } from "../../types/index.ts";
import { Response } from "express";

export const postImageController = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Invalid file type" });
    }
    const coverImageUrl = await uploadImageToSupabase(req.file);

    res.status(201).json({ coverImageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
};
