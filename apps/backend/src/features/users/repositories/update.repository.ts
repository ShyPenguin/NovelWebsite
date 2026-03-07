import { UserTable } from "@/infrastructure/db/schemas/users.ts";
import { UpdateResourceFactory } from "@/shared/factories/repository/update.repository.ts";

export const updateUserTx = UpdateResourceFactory({
  table: UserTable,
  tableId: UserTable.id,
});
