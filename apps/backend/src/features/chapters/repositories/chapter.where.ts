import { ChapterTable } from "@/infrastructure/db/schemas/chapters.ts";
import { WhereResourceFactory } from "@/shared/factories/repository/where.repository.ts";

export const chapterWhereMap = {
  id: WhereResourceFactory({ tableId: ChapterTable.id }),
};

export type ChapterWhere = keyof typeof chapterWhereMap;
