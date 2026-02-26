import { ChapterTable } from "@/infrastructure/db/schemas/chapters.ts";
import { NovelTable, UserTable } from "@/infrastructure/db/schemas/index.ts";
import { DbExecTypes } from "@/infrastructure/db/type.ts";
import { chapterSelectMap } from "@/features/chapters/repositories/selections.ts";
import { chapterAlias } from "@/shared/utils/databaseAlises.ts";
import { ChapterSelectDTO } from "@repo/contracts/dto/chapter";
import { eq, sql } from "drizzle-orm";

export const buildChaptersBaseQuery = ({
  type,
  tx,
}: {
  type: ChapterSelectDTO;
  tx: DbExecTypes;
}) => {
  const select = chapterSelectMap[type];

  switch (type) {
    case "detail": {
      return tx
        .select(select)
        .from(chapterAlias)
        .leftJoin(NovelTable, eq(NovelTable.id, chapterAlias.novelId))
        .leftJoin(UserTable, eq(NovelTable.translatorId, UserTable.id));
    }
    case "thumbnail": {
      return tx.select(select).from(ChapterTable);
    }
    case "poster": {
      return tx
        .select(select)
        .from(ChapterTable)
        .leftJoin(NovelTable, eq(NovelTable.id, ChapterTable.novelId))
        .leftJoin(UserTable, eq(NovelTable.translatorId, UserTable.id));
    }
  }
};

export const buildChapterCountQuery = ({ tx }: { tx: DbExecTypes }) => {
  return tx
    .select({
      count: sql<number>`count(distinct ${ChapterTable.id})`,
    })
    .from(ChapterTable);
};
