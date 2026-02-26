import { AuthorTable } from "@/infrastructure/db/schemas/authors.ts";
import { DeleteResourceFactory } from "@/shared/factories/repository/delete.repository.ts";

export const deleteAuthorTx = DeleteResourceFactory({
  table: AuthorTable,
  tableId: AuthorTable.id,
});
