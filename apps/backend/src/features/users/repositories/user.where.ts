import { UserTable } from "@/infrastructure/db/schemas/users.js";
import { WhereResourceFactory } from "@/shared/factories/repository/where.repository.js";

export const userWhereMap = {
  id: WhereResourceFactory({ tableId: UserTable.id }),
  username: WhereResourceFactory({ tableId: UserTable.username }),
};

export type UserWhere = keyof typeof userWhereMap;
