import { DbExecTypes } from "@/infrastructure/db/type.js";
import { sql } from "drizzle-orm";
import { userSelectMap } from "./user.selections.js";
import { UserTable } from "@/infrastructure/db/schemas/users.js";
import { UserSelectDTO } from "@repo/contracts/dto/user";

export const buildUsersBaseQuery = ({
  type,
  tx,
}: {
  type: UserSelectDTO;
  tx: DbExecTypes;
}) => {
  const select = userSelectMap[type];

  switch (type) {
    case "detail":
    case "thumbnail": {
      return tx.select(select).from(UserTable);
    }
  }
};

export const buildUserCountQuery = ({ tx }: { tx: DbExecTypes }) => {
  return tx
    .select({
      count: sql<number>`count(distinct ${UserTable.id})`,
    })
    .from(UserTable);
};

export type UserBaseQuery = ReturnType<
  typeof buildUsersBaseQuery | typeof buildUserCountQuery
>;
