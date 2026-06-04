import { UserTable } from "@/infrastructure/db/schemas/users.js";
import { eq } from "drizzle-orm";

export const userWhereMap = {
  id: ({ id }: { id: string }) => eq(UserTable.id, id),
  username: ({ username }: { username: string }) =>
    eq(UserTable.username, username),
};

export type UserWhere = typeof userWhereMap;
