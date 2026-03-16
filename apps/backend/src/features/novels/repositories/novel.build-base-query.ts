import {
  AuthorTable,
  NovelTable,
  UserTable,
} from "@/infrastructure/db/schemas/index.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { NovelSelectDTO } from "@repo/contracts/dto/novel";
import { sql, eq } from "drizzle-orm";
import { novelSelectMap } from "./novel.selections.js";

export const buildNovelsBaseQuery = <T extends NovelSelectDTO>({
  type,
  tx,
}: {
  type: T;
  tx: DbExecTypes;
}) => {
  const select = novelSelectMap[type];

  switch (type) {
    case "detail": {
      return tx
        .select(select)
        .from(NovelTable)
        .leftJoin(AuthorTable, eq(NovelTable.authorId, AuthorTable.id))
        .leftJoin(UserTable, eq(NovelTable.translatorId, UserTable.id));
    }
    case "thumbnail":
    case "auth": {
      return tx
        .select(select)
        .from(NovelTable)
        .leftJoin(UserTable, eq(NovelTable.translatorId, UserTable.id));
    }
    case "trend": {
      return tx.select(select).from(NovelTable);
    }
  }
};

export const buildNovelCountQuery = ({ tx }: { tx: DbExecTypes }) => {
  return tx
    .select({
      count: sql<number>`count(distinct ${NovelTable.id})`,
    })
    .from(NovelTable);
};
