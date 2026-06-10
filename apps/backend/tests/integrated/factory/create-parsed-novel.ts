import { createNovelTx } from "@/features/novels/repositories/create.repository.js";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.js";
import { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { testDb } from "../db/db-test.js";
import { getNovelDetailByIdTx } from "@/features/novels/repositories/get-novel-one.repository.js";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";

export const createParsedNovel = async ({
  novel,
  authorId,
  translatorId,
}: {
  novel: NovelTableInsert;
  authorId: string;
  translatorId: string;
}): Promise<NovelDetailDTO> => {
  const novelRegResult = await createNovelTx({
    tx: testDb,
    form: {
      ...novel,
      authorId,
      translatorId,
    },
  });

  const getRegResult = await getNovelDetailByIdTx(
    { id: novelRegResult.id || "" },
    testDb,
  );
  return NovelDetailSchema.parse(getRegResult);
};
