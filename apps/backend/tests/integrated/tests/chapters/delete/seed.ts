import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.js";
import { ChapterTableInsert } from "@/infrastructure/db/schemas/chapters.js";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.js";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.js";
import { testDb, redisDb } from "tests/integrated/db/db-test.js";
import { createNovelWithChapters } from "tests/integrated/factory/novel-with-chapters/index.js";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.js";
import {
  userStaff,
  userAdmin,
  readerFirst,
  userStaff2,
} from "tests/mockdata.js";
import data from "tests/mockdb.json" with { type: "json" };

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
