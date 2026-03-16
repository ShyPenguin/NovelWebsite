import { db } from "@/infrastructure/db/index.js";
import { DbClientType, DbPoolType } from "@/infrastructure/db/type.js";
import {
  BaseError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors/index.js";
import { requirePermission } from "@/shared/utils/require-permission.js";
import { UserSession } from "@repo/contracts/dto/auth";
import { AuthorThumbnailDTO, AuthorFormDTO } from "@repo/contracts/dto/author";
import { updateAuthorTx } from "../repositories/update.repository.js";

export const updateAuthorService = async ({
  form,
  id,
  user,
  tx = db,
}: {
  form: AuthorFormDTO;
  id: AuthorThumbnailDTO["id"];
  user: UserSession;
  tx?: DbPoolType | DbClientType;
}): Promise<AuthorThumbnailDTO> => {
  requirePermission({
    user,
    resource: "authors",
    action: "update",
    ctx: {
      data: { id },
    },
  });
  try {
    const result = await updateAuthorTx({
      tx,
      form,
      id,
    });

    if (!result) {
      throw new NotFoundError("authors");
    }

    return result;
  } catch (err: any) {
    if (err.constructor.name == "NotFoundError")
      throw new NotFoundError("authors");

    if (err.code === "23505" && err.detail?.includes("name")) {
      throw new ValidationError("Name is already taken");
    }
    throw new BaseError(500, "Internal Server Error");
  }
};
