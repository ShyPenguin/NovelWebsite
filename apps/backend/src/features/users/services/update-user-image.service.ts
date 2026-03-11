import { db } from "@/infrastructure/db/index.ts";
import {
  BaseError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors/index.ts";
import { UserDetailDTO, UserDetailEncodeDTO } from "@repo/contracts/dto/user";
import { UserSession } from "@repo/contracts/dto/auth";
import { deleteImageFromSupabase } from "@/infrastructure/supabase/repository/supabaseDelete.ts";
import { uploadImageToSupabase } from "@/infrastructure/supabase/repository/supabaseUpload.ts";
import { updateUserTx } from "../repositories/update.repository.ts";
import { requirePermission } from "@/shared/utils/require-permission.ts";
import { USER_URL_SUPABASE_PATH } from "@/shared/constants/index.ts";
import { getUserDetailByIdTx } from "../repositories/get-user-one.repository.ts";
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

  const { path, url } = await uploadImageToSupabase(
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
      await deleteImageFromSupabase(resourceUser.imagePath);
    }

    return UserDetailSchema.encode({
      ...resourceUser,
      updatedAt: updatedUser.updatedAt,
      createdAt: updatedUser.createdAt,
      imageUrl: url,
    });
  } catch (err) {
    await deleteImageFromSupabase(path);
    throw new BaseError(500, "Internal Server Error");
  }
};
