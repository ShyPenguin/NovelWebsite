import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";
import { UserTable } from "../../../infrastructure/db/schemas/index.js";

export const createUserTx = CreateResourceFactory<typeof UserTable>({
  table: UserTable,
});
