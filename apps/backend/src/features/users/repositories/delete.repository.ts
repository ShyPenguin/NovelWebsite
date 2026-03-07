import { UserTable } from "@/infrastructure/db/schemas/users.ts";
import { DeleteResourceFactory } from "@/shared/factories/repository/delete.repository.ts";

export const deleteUserTx = DeleteResourceFactory({
  table: UserTable,
  tableId: UserTable.id,
});
