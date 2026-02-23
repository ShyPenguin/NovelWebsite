import {
  AuthorTableSelect,
  NovelTableInsert,
} from "../../../../../src/db/schemas/index.ts";
import { createAuthorTx } from "../../../../../src/repositories/authors/create.ts";
import { createNovelTx } from "../../../../../src/repositories/novels/create.ts";
import { readerFirst, userStaff } from "../../../../mockdata.ts";
import { redisDb, testDb } from "../../../db/db-test.ts";
import data from "../../../../mockdb.json" with { type: "json" };
import { mockCreateUserWithSessionGoogle } from "../../../factory/user/with-session.ts";
import { createChapterTx } from "../../../../../src/repositories/chapters/create.ts";
import {
  SOURCE_DOC_URL,
  TEST_SOURCE_DOC_URL,
} from "../../../../constants/index.ts";
import { ChapterFormDTO } from "@repo/contracts/dto/chapter";
import { getFormattedDate } from "@repo/contracts/utils/getFormattedDate";

export const seedBeforeAll = async () => {
  const staff = await mockCreateUserWithSessionGoogle(
    userStaff,
    "1",
    testDb,
    redisDb,
  );
  const reader = await mockCreateUserWithSessionGoogle(
    readerFirst,
    "2",
    testDb,
    redisDb,
  );
  const author: AuthorTableSelect = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });
  const novelResult = await createNovelTx({
    tx: testDb,
    form: {
      ...(data.novels[0] as NovelTableInsert),
      authorId: author!.id,
      translatorId: staff!.user.id,
    },
  });

  const chapter = data.chapters.filter((chapter) =>
    chapter.novel_id.includes(novelResult.title),
  )[0];

  const seededChapter = await createChapterTx({
    tx: testDb,
    form: {
      novelId: novelResult.id,
      title: chapter.title,
      chapterNumber: 1,
      contentHtml: chapter.contentHtml,
      sourceDocUrl: SOURCE_DOC_URL,
      access: chapter.access ? "paid" : "free",
      publishedAt: new Date(getFormattedDate(new Date(chapter.publishedAt))),
    },
  });

  const inputChapter = {
    sourceDocUrl: TEST_SOURCE_DOC_URL,
    chapterNumber: 2,
    status: "published",
    access: "free",
    publishedAt: getFormattedDate(new Date()),
  } satisfies ChapterFormDTO;
  return {
    getNovel: () => novelResult,
    getStaff: () => staff,
    getReader: () => reader,
    getSeededChapter: () => seededChapter,
    getInputChapter: () => inputChapter,
  };
};
