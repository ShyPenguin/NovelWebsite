import { AuthorTable } from "@/infrastructure/db/schemas/authors.ts";
import { UpdateResourceFactory } from "@/shared/factories/repository/update.repository.ts";

export const updateAuthorTx = UpdateResourceFactory({
  table: AuthorTable,
  tableId: AuthorTable.id,
});
