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

export const getAnnouncementsTx = async ({
  tx,
  query,
  type,
}: {
  tx: DbExecTypes;
  query: AnnouncementQueryOutput;
  type: AnnouncementSelectDTO;
}) => {
  const baseQuery = preparingQuery({ tx, query, type });
  return await baseQuery;
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
