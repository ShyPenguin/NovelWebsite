import { AuthorTable } from "@/db/schemas/authors.ts";
import { UpdateResourceFactory } from "../factories/update.ts";

export const updateAuthorTx = UpdateResourceFactory({
  table: AuthorTable,
  tableId: AuthorTable.id,
});
