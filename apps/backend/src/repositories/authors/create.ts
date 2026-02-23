import { AuthorTable } from "../../db/schemas/authors.ts";
import { CreateResourceFactory } from "../factories/create.ts";

export const createAuthorTx = CreateResourceFactory<typeof AuthorTable>({
  table: AuthorTable,
});
