import { AuthorTable } from "@/infrastructure/db/schemas/authors.js";
import { DeleteResourceFactory } from "@/shared/factories/repository/delete.repository.js";

export const deleteAuthorTx = DeleteResourceFactory({
  table: AuthorTable,
  tableId: AuthorTable.id,
});
