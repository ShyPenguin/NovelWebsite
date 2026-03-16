import { NovelTable } from "@/infrastructure/db/schemas/novels.js";
import { WhereResourceFactory } from "@/shared/factories/repository/where.repository.js";

export const novelWhereMap = {
  id: WhereResourceFactory({ tableId: NovelTable.id }),
};

export type NovelWhere = keyof typeof novelWhereMap;
