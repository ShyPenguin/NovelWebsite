import { UserTable } from "../../db/schemas/index.ts";
import { CreateResourceFactory } from "../factories/create.ts";

export const createUserTx = CreateResourceFactory<typeof UserTable>({
  table: UserTable,
});
