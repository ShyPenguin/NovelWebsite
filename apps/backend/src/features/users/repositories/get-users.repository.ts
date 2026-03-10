import { eq, ilike, sql, SQL } from "drizzle-orm";
import { Paginated } from "@repo/contracts/dto/paginated";
import { DEFAULT_PAGE_SIZE } from "@repo/contracts/constants";
import { UserSelectDTO } from "@repo/contracts/dto/user";
import {
  buildUserCountQuery,
  buildUsersBaseQuery,
} from "./user.build-base-query.ts";
import { UserTable } from "@/infrastructure/db/schemas/users.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { applyWhere } from "@/shared/utils/apply-where.ts";
import { paginate } from "@/shared/utils/paginate.ts";
import { parseSortQuery } from "@/shared/utils/parse-sort-query.ts";
import { userSort, userSortWithDirection } from "@repo/contracts/fields/users";

type UserSort = (typeof userSort)[number];
type UserSortWithDirection = (typeof userSortWithDirection)[number];
const sortableColumns = {
  name: UserTable.name,
  username: UserTable.username,
  createdAt: UserTable.createdAt,
  updatedAt: UserTable.updatedAt,
} satisfies Record<UserSort, unknown>;

export const getUsersTx = async ({
  tx,
  query,
  type,
}: {
  tx: DbExecTypes;
  query: Record<string, any>;
  type: UserSelectDTO;
}) => {
  const sortOrder = parseSortQuery({
    sortParam: query.sort
      ? query.sort
      : ("asc(name)" satisfies UserSortWithDirection),
    sortableColumns: sortableColumns,
  });

  const baseQuery = preparingQuery({ tx, query, type });
  const result = await baseQuery.orderBy(...sortOrder);
  return result;
};

export const getPaginatedUsersTx = async <T>({
  tx,
  query,
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  type,
}: {
  tx: DbExecTypes;
  query: Record<string, any>;
  page: number;
  pageSize: number;
  type: UserSelectDTO;
}): Promise<Paginated<T>> => {
  // Parse the sort
  const sortOrder = parseSortQuery({
    sortParam: query.sort ? query.sort : "asc(userNumber)",
    sortableColumns: sortableColumns,
  });

  // Prepare the query
  const baseQuery = preparingQuery({ tx, query, type });
  const countQuery = preparingQuery({
    tx,
    query,
    type: "count",
  });

  return paginate<T>({
    query: baseQuery,
    countQuery,
    page,
    pageSize,
    sort: sortOrder,
  });
};

const preparingQuery = ({
  tx,
  query,
  type,
}: {
  tx: DbExecTypes;
  query: Record<string, any>;
  type: UserSelectDTO | "count";
}) => {
  const baseQuery =
    type !== "count"
      ? buildUsersBaseQuery({ tx, type })
      : buildUserCountQuery({ tx });

  applyUsersFilters({ query, baseQuery });
  return baseQuery;
};

const applyUsersFilters = <Q extends any>({
  query,
  baseQuery,
}: {
  query: Record<string, any>;
  baseQuery: Q;
}) => {
  const andFilters: SQL[] = [];
  const orFilters: SQL[] = [];

  if (query.search) {
    orFilters.push(ilike(UserTable.name, `%${query.search}%`));
    orFilters.push(ilike(UserTable.username, `%${query.search}%`));
    orFilters.push(ilike(UserTable.email, `%${query.search}%`));
  }

  if (query.role && query.role !== "all") {
    andFilters.push(eq(UserTable.role, query.role));
  }

  applyWhere({ q: baseQuery, orFilters, andFilters });

  return baseQuery;
};
