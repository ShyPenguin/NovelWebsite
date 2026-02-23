import { createAuthorTx } from "../../../../../../src/repositories/authors/create.ts";
import { createUserTx } from "../../../../../../src/repositories/users/create.ts";
import { userStaff } from "../../../../../mockdata.ts";
import { testDb } from "../../../../db/db-test.ts";
import data from "../../../../../mockdb.json" with { type: "json" };
import { createNovelTx } from "../../../../../../src/repositories/novels/index.ts";
import { NovelTableInsert } from "../../../../../../src/db/schemas/index.ts";
import { createChapterTx } from "../../../../../../src/repositories/chapters/create.ts";
import { SOURCE_DOC_URL } from "../../../../../constants/index.ts";
import { getFormattedDate } from "@repo/contracts/utils/getFormattedDate";

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
