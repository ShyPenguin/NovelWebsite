import { UserTable } from "@/infrastructure/db/schemas/users.js";
import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.js";

export const createUserTx = CreateResourceFactory<typeof UserTable>({
  table: UserTable,
});
