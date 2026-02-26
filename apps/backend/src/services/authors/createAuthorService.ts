import { db } from "@/db/index.ts";
import { DbExecTypes } from "@/db/type.ts";
import { createAuthorTx } from "@/repositories/authors/create.ts";
import { BaseError, ValidationError } from "@/utils/error.ts";
import { requirePermission } from "@/utils/requirePermission.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { AuthorThumbnailDTO, AuthorFormDTO } from "@repo/contracts/dto/author";

export const createAuthorService = async ({
  form,
  user,
  tx = db,
}: {
  form: AuthorFormDTO;
  user: UserSession;
  tx?: DbExecTypes;
}): Promise<AuthorThumbnailDTO> => {
  requirePermission({
    user,
    resource: "authors",
    action: "create",
  });

  try {
    const author = await createAuthorTx({
      tx,
      form,
    });

    return author;
  } catch (err: any) {
    if (err.code === "23505" && err.detail?.includes("name")) {
      throw new ValidationError("Name is already taken");
    }
    throw new BaseError(500, "Internal Server Error");
  }
};
