import { db } from "@/infrastructure/db/index.ts";
import { DbPoolType, DbClientType } from "@/infrastructure/db/type.ts";
import { getAllLatestChaptersTx } from "../repositories/get-novel-latest-chapters.repository.ts";

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
