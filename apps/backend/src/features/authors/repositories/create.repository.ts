import { AuthorTable } from "@/infrastructure/db/schemas/authors.ts";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.ts";

export const createAuthorTx = CreateResourceFactory<typeof AuthorTable>({
  table: AuthorTable,
});
