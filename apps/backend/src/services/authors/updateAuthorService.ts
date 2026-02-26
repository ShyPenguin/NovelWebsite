import { db } from "@/db/index.ts";
import { DbClientType, DbPoolType } from "@/db/type.ts";
import { updateAuthorTx } from "@/repositories/authors/update.ts";
import { BaseError, NotFoundError, ValidationError } from "@/utils/error.ts";
import { requirePermission } from "@/utils/requirePermission.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { AuthorThumbnailDTO, AuthorFormDTO } from "@repo/contracts/dto/author";

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
