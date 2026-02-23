import {
  ChapterTableInsert,
  NovelTableInsert,
} from "../../../../src/db/schemas/index.ts";
import { DbExecTypes } from "../../../../src/db/type.ts";
import { createChapterTx } from "../../../../src/repositories/chapters/create.ts";
import { upsertNovelCategoriesTx } from "../../../../src/repositories/novelCategories/upsertNovelCategories.ts";
import { createNovelTx } from "../../../../src/repositories/novels/create.ts";
import { upsertNovelScheduleTx } from "../../../../src/repositories/novelSchedule/index.ts";
import { WeekDay } from "../../../../src/services/novelSchedule/index.ts";

export const createNovelWithChapters = async ({
  tx,
  novel,
  authorId,
  translatorId,
  schedule,
  categories,
  chapters,
}: {
  tx: DbExecTypes;
  novel: NovelTableInsert;
  authorId: string;
  translatorId: string;
  schedule: WeekDay[];
  categories: string[];
  chapters: Omit<ChapterTableInsert, "novelId" | "sourceDocUrl">[];
}) => {
  const createdNovel = await createNovelTx({
    tx,
    form: {
      ...novel,
      authorId,
      translatorId,
    },
  });
  await upsertNovelScheduleTx(tx, createdNovel.id, schedule);
  await upsertNovelCategoriesTx(tx, createdNovel.id, categories);

  const createdChapters = await Promise.all(
    chapters.map((chapter) =>
      createChapterTx({
        tx,
        form: {
          novelId: createdNovel.id,
          title: chapter.title,
          chapterNumber: chapter.chapterNumber,
          contentHtml: chapter.contentHtml,
          sourceDocUrl:
            "https://docs.google.com/document/d/1hPxEP32WViJX0e5dQtmSKRS02996ghkQugCXG4s8u1s/edit?tab=t.0",
          access: chapter.access,
          publishedAt: chapter.publishedAt,
        },
      }),
    ),
  );

  return {
    novel: createdNovel,
    chapters: createdChapters,
  };
};
