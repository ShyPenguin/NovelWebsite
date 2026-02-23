import { db } from "../../db/index.ts";
import { DbPoolType, DbClientType } from "../../db/type.ts";
import { getAllLatestChaptersTx } from "../../repositories/chapters/getNovelLatestChapters.ts";

export const getNovelLatestChaptersService = async (
  {
    tx,
  }: {
    tx: DbPoolType | DbClientType;
  } = {
    tx: db,
  },
) => {
  const result = await getAllLatestChaptersTx({ tx });
  return result;
};
