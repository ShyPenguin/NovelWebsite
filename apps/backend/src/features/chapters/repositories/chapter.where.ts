import { ChapterTable } from "@/infrastructure/db/schemas/chapters.js";
import { WhereResourceFactory } from "@/shared/factories/repository/where.repository.js";

export const chapterWhereMap = {
  id: WhereResourceFactory({ tableId: ChapterTable.id }),
};

export type ChapterWhere = keyof typeof chapterWhereMap;
