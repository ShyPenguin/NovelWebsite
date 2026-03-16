import { db } from "@/infrastructure/db/index.js";
import {
  BaseError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors/index.js";
import { UserDetailDTO, UserDetailEncodeDTO } from "@repo/contracts/dto/user";
import { UserSession } from "@repo/contracts/dto/auth";
import { deleteImageFromStore } from "@/infrastructure/storage/repository/storageDelete.js";
import { uploadImageToStorage } from "@/infrastructure/storage/repository/storageUpload.js";
import { updateUserTx } from "../repositories/update.repository.js";
import { requirePermission } from "@/shared/utils/require-permission.js";
import { USER_URL_SUPABASE_PATH } from "@/shared/constants/index.js";
import { getUserDetailByIdTx } from "../repositories/get-user-one.repository.js";
import {
  UserDetailSchema,
  UserThumbnailSchema,
} from "@repo/contracts/schemas/user";

export const updateUserImageService = async ({
  id,
  user,
  file,
}: {
  id: UserDetailDTO["id"];
  user: UserSession;
  file?: Express.Multer.File;
}): Promise<UserDetailEncodeDTO> => {
  if (!file) {
    throw new ValidationError("Image is required");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw new ValidationError("Invalid file type");
  }

  const resourceUser = await getUserDetailByIdTx({ id }, db);

  if (!resourceUser) throw new NotFoundError("users");

  requirePermission({
    user,
    resource: "users",
    action: "update",
    ctx: {
      data: UserThumbnailSchema.parse(resourceUser),
    },
  });

  const { path, url } = await uploadImageToStorage(
    file,
    USER_URL_SUPABASE_PATH,
  );

  try {
    const updatedUser = await updateUserTx({
      tx: db,
      id,
      form: {
        imageUrl: url,
        imagePath: path,
      },
    });

    if (resourceUser.imagePath) {
      await deleteImageFromStore(resourceUser.imagePath);
    }

    return UserDetailSchema.encode({
      ...resourceUser,
      updatedAt: updatedUser.updatedAt,
      createdAt: updatedUser.createdAt,
      imageUrl: url,
    });
  } catch (err) {
    await deleteImageFromStore(path);
    throw new BaseError(500, "Internal Server Error");
  }
};
