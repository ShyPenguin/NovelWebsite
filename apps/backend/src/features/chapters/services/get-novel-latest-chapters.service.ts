import { db } from "@/infrastructure/db/index.js";
import { DbPoolType, DbClientType } from "@/infrastructure/db/type.js";
import { getAllLatestChaptersTx } from "../repositories/get-novel-latest-chapters.repository.js";

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
