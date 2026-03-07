import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.ts";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { createChapterTx } from "@/features/chapters/repositories/create.repository.ts";
import { createNovelTx } from "@/features/novels/repositories/create.repository.ts";
import { createUserTx } from "@/features/users/repositories/create.repository.ts";
import { getFormattedDate } from "@repo/contracts/utils/getFormattedDate";
import { SOURCE_DOC_URL } from "tests/constants/index.ts";
import { testDb } from "tests/integrated/db/db-test.ts";
import { userStaff } from "tests/mockdata.ts";
import data from "tests/mockdb.json" with { type: "json" };

export const seedBeforeAll = async () => {
  const staff = await createUserTx({ tx: testDb, form: userStaff });
  const author = await createAuthorTx({ tx: testDb, form: data.authors[0] });

  const novelTitle = "Omniscient Reader's Viewpoint";
  const omniscientReaderNovel = data.novels.filter((novel) =>
    novel.title.includes(novelTitle),
  )[0];
  const novel = await createNovelTx({
    tx: testDb,
    form: {
      ...(omniscientReaderNovel as NovelTableInsert),
      authorId: author.id,
      translatorId: staff.id,
    },
  });

  const chapters = data.chapters
    .filter((chapter) => chapter.novel_id.includes(novelTitle))
    .slice(0, 3);

  const createdChapters = await Promise.all(
    chapters.map((chapter) => {
      return createChapterTx({
        tx: testDb,
        form: {
          title: chapter.title,
          chapterNumber: chapter.chapterNumber,
          novelId: novel.id,
          sourceDocUrl: SOURCE_DOC_URL,
          contentHtml: chapter.contentHtml,
          access: chapter.access ? "paid" : "free",
          publishedAt: new Date(
            getFormattedDate(new Date(chapter.publishedAt)),
          ),
        },
      });
    }),
  );

  return {
    getChapter: () => createdChapters[0],
    getChapterSecond: () => createdChapters[1],
    getChapterThird: () => createdChapters[2],
    getNovel: () => novel,
  };
};
