import { eq, ilike, sql, SQL } from "drizzle-orm";
import { DbExecTypes } from "../../db/type.ts";
import { ChapterTable } from "../../db/schemas/chapters.ts";
import { applyWhere } from "../../utils/applyWhere.ts";
import { parseSortQuery } from "../../utils/parseSortQuery.ts";
import { Paginated } from "@repo/contracts/dto/paginated";
import { paginate } from "../../utils/paginate.ts";
import { CHAPTER_PAGE_SIZE } from "@repo/contracts/constants";
import { ChapterSelectDTO } from "@repo/contracts/dto/chapter";
import {
  buildChapterCountQuery,
  buildChaptersBaseQuery,
} from "./buildBaseQuery.ts";

const sortableColumns = {
  chapterNumber: ChapterTable.chapterNumber,
};

export const getChaptersTx = async ({
  tx,
  query,
  type,
}: {
  tx: DbExecTypes;
  query: Record<string, any>;
  type: ChapterSelectDTO;
}) => {
  const sortOrder = parseSortQuery({
    sortParam: query.sort ? query.sort : "asc(chapterNumber)",
    sortableColumns: sortableColumns,
  });

  const baseQuery = preparingQuery({ tx, query, type });
  const result = await baseQuery.orderBy(...sortOrder);
  return result;
};

export const getPaginatedChaptersTx = async <T>({
  tx,
  query,
  page,
  pageSize = CHAPTER_PAGE_SIZE,
  type,
}: {
  tx: DbExecTypes;
  query: Record<string, any>;
  page: number;
  pageSize: number;
  type: ChapterSelectDTO;
}): Promise<Paginated<T>> => {
  // Parse the sort
  const sortOrder = parseSortQuery({
    sortParam: query.sort ? query.sort : "asc(chapterNumber)",
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
  query: Record<string, any>;
  type: ChapterSelectDTO | "count";
}) => {
  const baseQuery =
    type !== "count"
      ? buildChaptersBaseQuery({ tx, type })
      : buildChapterCountQuery({ tx });

  applyChaptersFilters({ query, baseQuery });
  return baseQuery;
};

const applyChaptersFilters = <Q extends any>({
  query,
  baseQuery,
}: {
  query: Record<string, any>;
  baseQuery: Q;
}) => {
  const andFilters: SQL[] = [];
  const orFilters: SQL[] = [];

  if (query.search) {
    orFilters.push(ilike(ChapterTable.title, `%${query.search}%`));
    if (/^\d+$/.test(query.search)) {
      orFilters.push(eq(ChapterTable.chapterNumber, Number(query.search)));
    } else {
      orFilters.push(ilike(ChapterTable.title, `%${query.search}%`));
    }
  }
  // Example: novelId must match exactly → AND
  if (query.novelId) {
    andFilters.push(eq(ChapterTable.novelId, query.novelId));
  }

  if (query.access) {
    andFilters.push(eq(ChapterTable.access, query.access));
  }

  applyWhere({ q: baseQuery, orFilters, andFilters });

  return baseQuery;
};
