import { eq, ilike, sql, SQL } from "drizzle-orm";
import { applyWhere } from "../../utils/applyWhere.ts";
import { AuthorTable } from "../../db/schemas/authors.ts";
import { CategoryTable } from "../../db/schemas/categories.ts";
import { NovelTable, UserTable } from "../../db/schemas/index.ts";
import { parseSortQuery } from "../../utils/parseSortQuery.ts";
import { paginate } from "../../utils/paginate.ts";
import { PAGE_SIZE } from "../../constants/index.ts";
import { Paginated } from "@repo/contracts/dto/paginated";
import { DbExecTypes } from "../../db/type.ts";
import { NovelQueryOutput } from "../../validations/NovelValidator.ts";
import { NovelSelectDTO } from "@repo/contracts/dto/novel";
import {
  buildNovelCountQuery,
  buildNovelsBaseQuery,
} from "./buildBaseQuery.ts";

const sortableColumns = {
  title: NovelTable.title,
  createdAt: NovelTable.createdAt,
  updatedAt: NovelTable.updatedAt,
};

export const getNovelsRepo = async ({
  tx,
  query,
  type,
}: {
  tx: DbExecTypes;
  query: NovelQueryOutput;
  type: NovelSelectDTO;
}) => {
  // Parse the sort
  const sortOrder = parseSortQuery({
    sortParam: query.sort ? query.sort : "desc(title)",
    sortableColumns: sortableColumns,
  });

  // Prepare the query
  const baseQuery = preparingQuery({ tx, query, type });
  const result = await baseQuery.orderBy(...sortOrder);

  return result;
};

export const getPaginatedNovelsRepo = async <T>({
  tx,
  query,
  type,
  page,
  pageSize = PAGE_SIZE,
}: {
  tx: DbExecTypes;
  query: NovelQueryOutput;
  type: NovelSelectDTO;
  page: number;
  pageSize: number;
}): Promise<Paginated<T>> => {
  // Check Status If it's all removed the status
  // Parse the sort
  const sortOrder = parseSortQuery({
    sortParam: query.sort ? query.sort : "desc(title)",
    sortableColumns: sortableColumns,
  });

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
    sort: sortOrder,
  });
};

const preparingQuery = ({
  tx,
  query,
  type,
}: {
  tx: DbExecTypes;
  query: NovelQueryOutput;
  type: NovelSelectDTO | "count";
}) => {
  const baseQuery =
    type == "count"
      ? buildNovelCountQuery({ tx })
      : buildNovelsBaseQuery({ tx, type });

  applyNovelFilters({ query, baseQuery, type });
  return baseQuery;
};

type NovelBaseQuery = ReturnType<
  typeof buildNovelsBaseQuery | typeof buildNovelCountQuery
>;

const applyNovelFilters = ({
  query,
  baseQuery,
  type,
}: {
  query: Record<string, any>;
  baseQuery: NovelBaseQuery;
  type: NovelSelectDTO | "count";
}) => {
  const andFilters: SQL[] = [];
  const orFilters: SQL[] = [];

  if (query.search) {
    orFilters.push(ilike(NovelTable.title, `%${query.search}%`));
    orFilters.push(ilike(NovelTable.description, `%${query.search}%`));
  }

  query.status = query.status == "ALL" ? undefined : query.status;
  if (query.status) {
    andFilters.push(eq(NovelTable.status, query.status));
  }

  if (query.author) {
    orFilters.push(ilike(AuthorTable.name, `%${query.author}%`));
    if (type !== "detail" && type !== "poster") {
      baseQuery.leftJoin(AuthorTable, eq(NovelTable.authorId, AuthorTable.id));
    }
  }

  if (query.translator) {
    orFilters.push(ilike(UserTable.username, `%${query.translator}%`));
    if (type !== "detail") {
      baseQuery.leftJoin(UserTable, eq(NovelTable.translatorId, UserTable.id));
    }
  }

  if (query.category) {
    andFilters.push(ilike(CategoryTable.name, `%${query.category}%`));
  }

  applyWhere({ q: baseQuery, orFilters, andFilters });
};
