import { AuthorTable } from "../../db/schemas/index.ts";
import { DeleteResourceFactory } from "../factories/delete.ts";

export const deleteAuthorTx = DeleteResourceFactory({
  table: AuthorTable,
  tableId: AuthorTable.id,
});
