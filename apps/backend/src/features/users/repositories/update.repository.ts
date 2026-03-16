import { UserTable } from "@/infrastructure/db/schemas/users.js";
import { UpdateResourceFactory } from "@/shared/factories/repository/update.repository.js";

export const updateUserTx = UpdateResourceFactory({
  table: UserTable,
  tableId: UserTable.id,
});
