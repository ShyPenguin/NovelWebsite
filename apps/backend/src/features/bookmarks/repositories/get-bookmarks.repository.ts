import { BookmarksTable } from "@/infrastructure/db/schemas/bookmarks.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { applyWhere } from "@/shared/utils/apply-where.js";
import { BookmarkSelectDTO } from "@repo/contracts/dto/bookmark";
import { eq, ilike, SQL } from "drizzle-orm";
import {
  buildBookmarkCountQuery,
  buildBookmarksBaseQuery,
} from "./bookmark.build-base-query.js";
import { DEFAULT_PAGE_SIZE } from "@repo/contracts/constants";
import { Paginated } from "@repo/contracts/dto/paginated";
import { paginate } from "@/shared/utils/paginate.js";

export const getBookmarksTx = async ({
  tx,
  query,
  type,
}: {
  tx: DbExecTypes;
  query: Record<string, any>;
  type: BookmarkSelectDTO;
}) => {
  const baseQuery = preparingQuery({ tx, query, type });
  const result = await baseQuery;
  return result;
};

export const getPaginatedBookmarksTx = async <T>({
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
  type: BookmarkSelectDTO;
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
  query: Record<string, any>;
  type: BookmarkSelectDTO | "count";
}) => {
  const baseQuery =
    type !== "count"
      ? buildBookmarksBaseQuery({ tx, type })
      : buildBookmarkCountQuery({ tx });

  applyBookmarksFilters({ query, baseQuery });
  return baseQuery;
};

const applyBookmarksFilters = <Q extends any>({
  query,
  baseQuery,
}: {
  query: Record<string, any>;
  baseQuery: Q;
}) => {
  const andFilters: SQL[] = [];
  const orFilters: SQL[] = [];

  //   if (query.search) {
  //     orFilters.push(ilike(.title, `%${query.search}%`));
  //     if (/^\d+$/.test(query.search)) {
  //       orFilters.push(eq(ChapterTable.chapterNumber, Number(query.search)));
  //     } else {
  //       orFilters.push(ilike(ChapterTable.title, `%${query.search}%`));
  //     }
  //   }
  // Example: novelId must match exactly → AND
  if (query.novelId) {
    andFilters.push(eq(BookmarksTable.novelId, query.novelId));
  }

  if (query.userId) {
    andFilters.push(eq(BookmarksTable.userId, query.userId));
  }

  applyWhere({ q: baseQuery, orFilters, andFilters });

  return baseQuery;
};
