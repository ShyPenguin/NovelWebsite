import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.ts";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.ts";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { SOURCE_DOC_URL } from "tests/constants/index.ts";
import { testDb, redisDb } from "tests/integrated/db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.ts";
import { userStaff } from "tests/mockdata.ts";
import { determineNovelFactory } from "tests/utils/determine-novel-id.ts";
import data from "tests/mockdb.json" with { type: "json" };
import { createNovelTx } from "@/features/novels/repositories/create.repository.ts";
import { createChapterTx } from "@/features/chapters/repositories/create.repository.ts";

export const seedBeforeAll = async () => {
  const staff = await mockCreateUserWithSessionGoogle(
    userStaff,
    "1",
    testDb,
    redisDb,
  );

  const author: AuthorTableSelect = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });

  const novels = await Promise.all(
    data.novels.map((novel) => {
      return createNovelTx({
        tx: testDb,
        form: {
          ...(novel as NovelTableInsert),
          authorId: author.id,
          translatorId: staff.user.id,
        },
      });
    }),
  );

  const sortNovels = novels.sort((a, b) =>
    a.title < b.title ? -1 : a.title > b.title ? 1 : 0,
  );
  const [novel, novel2, novel3, novel4, novel5, novel6, novel7] = sortNovels;

  const novelTest = novels.filter(
    (novel) =>
      novel.title == "I'm an Infinite Regressor, But I've Got Stories to Tell",
  );

  const determineNovelId = determineNovelFactory({
    novel: novel!.id,
    novel2: novel2!.id,
    novel3: novel3!.id,
    novel4: novel4!.id,
    novel5: novel5!.id,
    novel6: novel6!.id,
    novel7: novel7!.id,
  });

  await Promise.all(
    data["chapters"].slice(2, 14).map(async (chapter) => {
      return await createChapterTx({
        tx: testDb,
        form: {
          novelId: determineNovelId({
            novelId: chapter.novel_id,
          }),
          title: chapter.title,
          chapterNumber: chapter.chapterNumber,
          contentHtml: chapter.contentHtml,
          sourceDocUrl:
            "https://docs.google.com/document/d/1hPxEP32WViJX0e5dQtmSKRS02996ghkQugCXG4s8u1s/edit?tab=t.0",
          access: chapter.access ? "paid" : "free",
          publishedAt: new Date(chapter.publishedAt),
        },
      });
    }),
  );

  const freeChapter = await createChapterTx({
    tx: testDb,
    form: {
      title: data.chapters[0].title,
      chapterNumber: data.chapters[0].chapterNumber,
      novelId: determineNovelId({ novelId: data.chapters[0].novel_id }),
      sourceDocUrl: SOURCE_DOC_URL,
      contentHtml: data.chapters[0].contentHtml,
      access: "free",
      publishedAt: new Date(data.chapters[0].publishedAt),
    },
  });

  const paidChapter = await createChapterTx({
    tx: testDb,
    form: {
      title: data.chapters[1].title,
      chapterNumber: data.chapters[1].chapterNumber,
      novelId: determineNovelId({ novelId: data.chapters[1].novel_id }),
      sourceDocUrl: SOURCE_DOC_URL,
      contentHtml: data.chapters[1].contentHtml,
      access: "paid",
      publishedAt: new Date(data.chapters[1].publishedAt),
    },
  });

  return {
    getFreeChapter: () => freeChapter,
    getPaidChapter: () => paidChapter,
    getNovel: () => novelTest[0],
  };
};
