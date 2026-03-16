import { AuthorTable } from "@/infrastructure/db/schemas/authors.js";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";

export const createAuthorTx = CreateResourceFactory<typeof AuthorTable>({
  table: AuthorTable,
});
