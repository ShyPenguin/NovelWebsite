import { AuthorTable } from "@/infrastructure/db/schemas/authors.js";
import { UpdateResourceFactory } from "@/shared/factories/repository/update.repository.js";

export const updateAuthorTx = UpdateResourceFactory({
  table: AuthorTable,
  tableId: AuthorTable.id,
});
