import { db } from "@/db/index.ts";
import { getNovelDetailByIdTx } from "@/repositories/novels/getNovelById.ts";
import { UserSession } from "@/types/index.ts";
import {
  AuthorizationError,
  BaseError,
  NotFoundError,
  ValidationError,
} from "@/utils/error.ts";
import {
  NovelDetailDTO,
  NovelDetailEncodeDTO,
} from "@repo/contracts/dto/novel";
import { uploadImageToSupabase } from "../supabase/supabaseUpload.ts";
import { deleteImageFromSupabase } from "../supabase/supabaseDelete.ts";
import { updateNovelTx } from "@/repositories/novels/update.ts";

export const updateNovelCoverService = async ({
  id,
  user,
  file,
}: {
  id: NovelDetailDTO["id"];
  user: UserSession;
  file?: Express.Multer.File;
}): Promise<NovelDetailEncodeDTO> => {
  if (!file) {
    throw new ValidationError("Image is required");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw new ValidationError("Invalid file type");
  }

  const novel = await getNovelDetailByIdTx({
    id,
    tx: db,
  });

  if (!novel) throw new NotFoundError("novel");
  if (user.role !== "admin" && user.id !== novel.translator?.id)
    throw new AuthorizationError({ action: "update", resource: "novel" });

  const { path, url } = await uploadImageToSupabase(file);

  try {
    await updateNovelTx({
      tx: db,
      id,
      form: {
        coverImagePath: path,
        coverImageUrl: url,
      },
    });

    if (novel.coverImagePath) {
      await deleteImageFromSupabase(novel.coverImagePath);
    }

    return {
      ...novel,
      coverImagePath: path,
      coverImageUrl: url,
    };
  } catch (err) {
    await deleteImageFromSupabase(path);
    throw new BaseError(500, "Internal Server Error");
  }
};
