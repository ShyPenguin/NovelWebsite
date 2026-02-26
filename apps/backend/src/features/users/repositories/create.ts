import { CreateResourceFactory } from "@/shared/factories/repository/create.repository.ts";
import { UserTable } from "../../../infrastructure/db/schemas/index.ts";

export const createUserTx = CreateResourceFactory<typeof UserTable>({
  table: UserTable,
});
