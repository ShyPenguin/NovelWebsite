import { db } from "@/db/index.ts";
import { DbExecTypes } from "@/db/type.ts";
import { createAuthorTx } from "@/repositories/authors/create.ts";
import { BaseError, ValidationError } from "@/utils/error.ts";
import { AuthorDTO, AuthorFormDTO } from "@repo/contracts/dto/author";

export const createAuthorService = async ({
  form,
  tx = db,
}: {
  form: AuthorFormDTO;
  tx?: DbExecTypes;
}): Promise<AuthorDTO> => {
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
