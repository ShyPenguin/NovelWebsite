import { UserTable } from "@/infrastructure/db/schemas/users.js";
import { DeleteResourceFactory } from "@/shared/factories/repository/delete.repository.js";

export const deleteUserTx = DeleteResourceFactory({
  table: UserTable,
  tableId: UserTable.id,
});
