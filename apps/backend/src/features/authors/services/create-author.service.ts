import { db } from "@/infrastructure/db/index.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { BaseError, ValidationError } from "@/shared/errors/index.ts";
import { requirePermission } from "@/shared/utils/require-permission.ts";
import { UserSession } from "@repo/contracts/dto/auth";
import { AuthorThumbnailDTO, AuthorFormDTO } from "@repo/contracts/dto/author";
import { createAuthorTx } from "../repositories/create.repository.ts";

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
    ctx: {},
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
