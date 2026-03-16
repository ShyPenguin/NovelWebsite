import { DbExecTypes } from "@/infrastructure/db/type.js";
import { AuthorQueryOutput } from "@/features/authors/author.schema.js";
import { AuthorSelectDTO } from "@repo/contracts/dto/author";
import {
  AuthorBaseQuery,
  buildAuthorCountQuery,
  buildAuthorsBaseQuery,
} from "./author.build-base-query.js";
import { ilike, SQL } from "drizzle-orm";
import { AuthorTable } from "@/infrastructure/db/schemas/authors.js";
import { applyWhere } from "@/shared/utils/apply-where.js";
import { Paginated } from "@repo/contracts/dto/paginated";
import { paginate } from "@/shared/utils/paginate.js";
import { PAGE_SIZE_AUTHOR } from "@/shared/constants/index.js";

export const getAuthorsTx = async ({
  tx,
  query,
  type,
}: {
  tx: DbExecTypes;
  query: AuthorQueryOutput;
  type: AuthorSelectDTO;
}) => {
  const baseQuery = preparingQuery({ tx, query, type });
  return await baseQuery;
};

export const getPaginatedAuthorsTx = async <T>({
  tx,
  query,
  type,
  page,
  pageSize = PAGE_SIZE_AUTHOR,
}: {
  tx: DbExecTypes;
  query: AuthorQueryOutput;
  type: AuthorSelectDTO;
  page: number;
  pageSize: number;
}): Promise<Paginated<T>> => {
  // Prepare the query
  const baseQuery = preparingQuery({ tx, query, type });
  const countQuery = preparingQuery({
    tx,
    query,
    type: "count",
  });

  return paginate({
    query: baseQuery,
    countQuery,
    page,
    pageSize,
  });
};

const preparingQuery = ({
  tx,
  query,
  type,
}: {
  tx: DbExecTypes;
  query: AuthorQueryOutput;
  type: AuthorSelectDTO | "count";
}) => {
  const baseQuery =
    type == "count"
      ? buildAuthorCountQuery({ tx })
      : buildAuthorsBaseQuery({ tx, type });

  applyAuthorFilters({ query, baseQuery, type });

  return baseQuery;
};

const applyAuthorFilters = ({
  query,
  baseQuery,
  type,
}: {
  query: AuthorQueryOutput;
  baseQuery: AuthorBaseQuery;
  type: AuthorSelectDTO | "count";
}) => {
  const andFilters: SQL[] = [];
  const orFilters: SQL[] = [];

  if (query.search) {
    orFilters.push(ilike(AuthorTable.name, `%${query.search}%`));
  }

  applyWhere({ q: baseQuery, orFilters, andFilters });
};
