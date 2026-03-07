import { UserTable } from "@/infrastructure/db/schemas/users.ts";
import { WhereResourceFactory } from "@/shared/factories/repository/where.repository.ts";

export const userWhereMap = {
  id: WhereResourceFactory({ tableId: UserTable.id }),
  username: WhereResourceFactory({ tableId: UserTable.username }),
};

export type UserWhere = keyof typeof userWhereMap;
