import { eq, ilike, SQL } from "drizzle-orm";
import { Paginated } from "@repo/contracts/dto/paginated";
import { NovelSelectDTO } from "@repo/contracts/dto/novel";
import {
  buildNovelCountQuery,
  buildNovelsBaseQuery,
} from "./novel.build-base-query.ts";
import { PAGE_SIZE } from "@/shared/constants/index.ts";
import { AuthorTable } from "@/infrastructure/db/schemas/authors.ts";
import { CategoryTable } from "@/infrastructure/db/schemas/categories.ts";
import { NovelTable } from "@/infrastructure/db/schemas/novels.ts";
import { UserTable } from "@/infrastructure/db/schemas/users.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { applyWhere } from "@/shared/utils/apply-where.ts";
import { paginate } from "@/shared/utils/paginate.ts";
import { parseSortQuery } from "@/shared/utils/parse-sort-query.ts";
import { NovelQueryOutput } from "@/features/novels/novel.schema.ts";

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
    if (type !== "detail" && type !== "auth") {
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
