import { DbExecTypes } from "@/infrastructure/db/type.js";
import { GetFetchReturn } from "@/shared/types/service.types.js";
import {
  BookmarkAuthDTO,
  BookmarkDetailDTO,
} from "@repo/contracts/dto/bookmark";
import {
  BookmarkDetailSchema,
  BookmarkAuthSchema,
} from "@repo/contracts/schemas/bookmark";
import { ZodType } from "zod";
import { buildBookmarksBaseQuery } from "./bookmark.build-base-query.js";
import { BookmarkWhere, bookmarksWhereMap } from "./bookmark.where.js";

type BookmarkDTOMap = {
  detail: BookmarkDetailDTO;
  auth: BookmarkAuthDTO;
};

export const getBookmarkFactory =
  <T extends keyof BookmarkDTOMap, W extends keyof BookmarkWhere>({
    type,
    schema,
    where,
  }: {
    type: T;
    schema: ZodType;
    where: W;
  }) =>
  async (
    params: Parameters<BookmarkWhere[W]>[0],
    tx: DbExecTypes,
  ): Promise<GetFetchReturn<BookmarkDTOMap, T> | null> => {
    const baseQuery = buildBookmarksBaseQuery({
      type,
      tx,
    });

    const fn = bookmarksWhereMap[where] as (
      arg: Parameters<BookmarkWhere[W]>[0],
    ) => any;

    const result = await baseQuery.where(fn(params));
    if (!result[0]) return null;
    return schema.encode(result[0]) as GetFetchReturn<BookmarkDTOMap, T>;
  };

export const getBookmarkDetailByIdTx = getBookmarkFactory({
  type: "detail",
  schema: BookmarkDetailSchema,
  where: "primary",
});

export const getBookmarkAuthByIdTx = getBookmarkFactory({
  type: "auth",
  schema: BookmarkAuthSchema,
  where: "primary",
});
