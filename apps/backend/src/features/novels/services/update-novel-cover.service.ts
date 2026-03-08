import { db } from "@/infrastructure/db/index.ts";
import {
  BaseError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors/index.ts";
import {
  NovelDetailDTO,
  NovelDetailEncodeDTO,
} from "@repo/contracts/dto/novel";
import { UserSession } from "@repo/contracts/dto/auth";
import { deleteImageFromSupabase } from "@/infrastructure/supabase/repository/supabaseDelete.ts";
import { uploadImageToSupabase } from "@/infrastructure/supabase/repository/supabaseUpload.ts";
import { getNovelDetailByIdTx } from "../repositories/get-novel-one.ts";
import { updateNovelTx } from "../repositories/update.repository.ts";
import { requirePermission } from "@/shared/utils/require-permission.ts";

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

  const novel = await getNovelDetailByIdTx({ id }, db);

  if (!novel) throw new NotFoundError("novels");

  requirePermission({
    user,
    resource: "novels",
    action: "update",
    ctx: {
      data: novel,
    },
  });

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
