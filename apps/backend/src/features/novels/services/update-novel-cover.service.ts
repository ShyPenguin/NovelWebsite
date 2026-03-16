import { db } from "@/infrastructure/db/index.js";
import {
  BaseError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors/index.js";
import {
  NovelDetailDTO,
  NovelDetailEncodeDTO,
} from "@repo/contracts/dto/novel";
import { UserSession } from "@repo/contracts/dto/auth";
import { deleteImageFromStore } from "@/infrastructure/storage/repository/storageDelete.js";
import { uploadImageToStorage } from "@/infrastructure/storage/repository/storageUpload.js";
import { getNovelDetailByIdTx } from "../repositories/get-novel-one.js";
import { updateNovelTx } from "../repositories/update.repository.js";
import { requirePermission } from "@/shared/utils/require-permission.js";
import { NOVEL_URL_SUPABASE_PATH } from "@/shared/constants/index.js";

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

  const { path, url } = await uploadImageToStorage(
    file,
    NOVEL_URL_SUPABASE_PATH,
  );

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
      await deleteImageFromStore(novel.coverImagePath);
    }

    return {
      ...novel,
      coverImagePath: path,
      coverImageUrl: url,
    };
  } catch (err) {
    await deleteImageFromStore(path);
    throw new BaseError(500, "Internal Server Error");
  }
};
