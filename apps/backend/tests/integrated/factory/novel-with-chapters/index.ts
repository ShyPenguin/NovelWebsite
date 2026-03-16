import { ChapterTableInsert } from "@/infrastructure/db/schemas/chapters.js";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.js";
import { Week } from "@/infrastructure/db/schemas/novelSchedule.js";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { createChapterTx } from "@/features/chapters/repositories/create.repository.js";
import { createNovelTx } from "@/features/novels/repositories/create.repository.js";
import { upsertNovelCategoriesTx } from "@/features/categories/repository/upsert-novel-categories.js";
import { upsertNovelScheduleTx } from "@/features/novels/services/upsert-novel-schedule.service.js";

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
  schedule: Week[];
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
