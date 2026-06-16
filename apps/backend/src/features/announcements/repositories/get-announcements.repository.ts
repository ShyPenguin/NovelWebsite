import { DbExecTypes } from "@/infrastructure/db/type.js";
import { AnnouncementSelectDTO } from "@repo/contracts/dto/announcement";
import {
  AnnouncementBaseQuery,
  buildAnnouncementCountQuery,
  buildAnnouncementsBaseQuery,
} from "./announcement.build-base-query.js";
import { ilike, SQL } from "drizzle-orm";
import { AnnouncementTable } from "@/infrastructure/db/schemas/announcements.js";
import { applyWhere } from "@/shared/utils/apply-where.js";
import { Paginated } from "@repo/contracts/dto/paginated";
import { paginate } from "@/shared/utils/paginate.js";
import { DEFAULT_PAGE_SIZE } from "@repo/contracts/constants";
import { AnnouncementQueryOutput } from "../announcement.schema.js";
import { parseSortQuery } from "@/shared/utils/parse-sort-query.js";

const sortableColumns = {
  updatedAt: AnnouncementTable.updatedAt,
  createdAt: AnnouncementTable.createdAt,
};

export const getAnnouncementsTx = async ({
  tx,
  query,
  type,
}: {
  tx: DbExecTypes;
  query: AnnouncementQueryOutput;
  type: AnnouncementSelectDTO;
}) => {
  // Parse the sort
  const sortOrder = parseSortQuery({
    sortParam: query.sort ? query.sort : "desc(createdAt)",
    sortableColumns: sortableColumns,
  });

  const baseQuery = preparingQuery({ tx, query, type });
  const result = await baseQuery.orderBy(...sortOrder);

  return result;
};

export const getPaginatedAnnouncementsTx = async <T>({
  tx,
  query,
  type,
  page,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  tx: DbExecTypes;
  query: AnnouncementQueryOutput;
  type: AnnouncementSelectDTO;
  page: number;
  pageSize: number;
}): Promise<Paginated<T>> => {
  // Parse the sort
  const sortOrder = parseSortQuery({
    sortParam: query.sort ? query.sort : "desc(createdAt)",
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
  query: AnnouncementQueryOutput;
  type: AnnouncementSelectDTO | "count";
}) => {
  const baseQuery =
    type == "count"
      ? buildAnnouncementCountQuery({ tx })
      : buildAnnouncementsBaseQuery({ tx, type });

  applyAnnouncementFilters({ query, baseQuery });

  return baseQuery;
};

const applyAnnouncementFilters = ({
  query,
  baseQuery,
}: {
  query: AnnouncementQueryOutput;
  baseQuery: AnnouncementBaseQuery;
}) => {
  const andFilters: SQL[] = [];
  const orFilters: SQL[] = [];

  if (query.search) {
    orFilters.push(ilike(AnnouncementTable.title, `%${query.search}%`));
    orFilters.push(ilike(AnnouncementTable.content, `%${query.search}%`));
  }

  applyWhere({ q: baseQuery, orFilters, andFilters });
};
