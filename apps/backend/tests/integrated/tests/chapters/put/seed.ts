import {
  AuthorTableSelect,
  NovelTableInsert,
} from "../../../../../src/db/schemas/index.ts";
import { createAuthorTx } from "../../../../../src/repositories/authors/create.ts";
import {
  readerFirst,
  userAdmin,
  userStaff,
  userStaff2,
} from "../../../../mockdata.ts";
import { redisDb, testDb } from "../../../db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "../../../factory/user/with-session.ts";
import data from "../../../../mockdb.json" with { type: "json" };
import { createNovelTx } from "../../../../../src/repositories/novels/index.ts";
import { ChapterFormDTO } from "@repo/contracts/dto/chapter";
import { createChapterService } from "../../../../../src/services/chapters/createChapterService.ts";
import {
  TEST_SOURCE_DOC_URL,
  TEST_SOURCE_DOC_URL_SECOND,
} from "../../../../constants/index.ts";
import { getFormattedDate } from "@repo/contracts/utils/getFormattedDate";

export const seedBeforeAll = async () => {
  const staff = await mockCreateUserWithSessionGoogle(
    userStaff,
    "1",
    testDb,
    redisDb,
  );
  const admin = await mockCreateUserWithSessionGoogle(
    userAdmin,
    "2",
    testDb,
    redisDb,
  );
  const reader = await mockCreateUserWithSessionGoogle(
    readerFirst,
    "3",
    testDb,
    redisDb,
  );
  const staffSecond = await mockCreateUserWithSessionGoogle(
    userStaff2,
    "4",
    testDb,
    redisDb,
  );

  const author: AuthorTableSelect = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });

  const novel = await createNovelTx({
    tx: testDb,
    form: {
      ...(data.novels[0] as NovelTableInsert),
      authorId: author!.id,
      translatorId: staff!.user.id,
    },
  });

  const input = data.chapters.filter((chapter) =>
    chapter.novel_id.includes(data.novels[0].title),
  )[0];

  const seededChapter = await createChapterService({
    novelId: novel.id,
    tx: testDb,
    user: staff!.user,
    form: {
      sourceDocUrl: TEST_SOURCE_DOC_URL,
      chapterNumber: 1,
      status: "draft",
      access: input.access ? "paid" : "free",
      publishedAt: new Date(getFormattedDate(new Date(input.publishedAt))),
    },
  });

  const inputChapter = {
    sourceDocUrl: TEST_SOURCE_DOC_URL_SECOND,
    chapterNumber: 2,
    status: "review",
    access: input.access ? "paid" : "free",
    publishedAt: getFormattedDate(new Date(input.publishedAt)),
  } satisfies ChapterFormDTO;

  return {
    getNovel: () => novel,
    getStaff: () => staff,
    getStaffSecond: () => staffSecond,
    getAdmin: () => admin,
    getReader: () => reader,
    getSeededChapter: () => seededChapter,
    getInputChapter: () => inputChapter,
  };
};
