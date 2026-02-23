import {
  AuthorTableSelect,
  ChapterTableInsert,
  NovelTableInsert,
} from "../../../../../src/db/schemas/index.ts";
import { createAuthorTx } from "../../../../../src/repositories/authors/create.ts";
import {
  userStaff,
  userAdmin,
  readerFirst,
  userStaff2,
} from "../../../../mockdata.ts";
import { testDb, redisDb } from "../../../db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "../../../factory/user/with-session.ts";
import data from "../../../../mockdb.json" with { type: "json" };
import { createNovelWithChapters } from "../../../factory/novel-with-chapters/index.ts";

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

  const dataChapters = data.chapters
    .filter((chapter) => chapter.novel_id.includes(data.novels[0].title))
    .slice(0, 2)
    .map((chapter) => {
      return {
        ...chapter,
        publishedAt: new Date(chapter.publishedAt),
        access: chapter.access ? "paid" : "free",
      } satisfies Omit<ChapterTableInsert, "novelId" | "sourceDocUrl">;
    });
  const result = await createNovelWithChapters({
    tx: testDb,
    novel: data.novels[0] as NovelTableInsert,
    authorId: author.id,
    translatorId: staff.user.id,
    schedule: ["SUN", "MON", "TUE", "WED"],
    categories: [],
    chapters: dataChapters,
  });

  return {
    getStaff: () => staff,
    getSecondStaff: () => staffSecond,
    getAdmin: () => admin,
    getReader: () => reader,
    getNovel: () => result.novel,
    getChapterByStaff: () => result.chapters[0],
    getChapterSecondByStaff: () => result.chapters[1],
    getAuthor: () => author,
  };
};
