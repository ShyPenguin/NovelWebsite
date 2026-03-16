import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.js";
import { ChapterTableInsert } from "@/infrastructure/db/schemas/chapters.js";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.js";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.js";
import { createNovelTx } from "@/features/novels/repositories/create.repository.js";
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

  const chapters = data.chapters
    .filter((chapter) => chapter.novel_id.includes(data.novels[0].title))
    .map((chapter) => {
      return {
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        contentHtml: chapter.contentHtml,
        access: chapter.access ? "paid" : "free",
        publishedAt: new Date(chapter.publishedAt),
      };
    }) as Omit<ChapterTableInsert, "novelId" | "sourceDocUrl">[];

  const novelWithChapters = await createNovelWithChapters({
    tx: testDb,
    novel: data.novels[0] as NovelTableInsert,
    authorId: author!.id,
    translatorId: staff!.user.id,
    schedule: ["FRI", "MON"],
    categories: [],
    chapters: chapters,
  });
  const novelByStaff = novelWithChapters.novel;
  const novelSecondByStaff = await createNovelTx({
    tx: testDb,
    form: {
      ...(data.novels[1] as NovelTableInsert),
      authorId: author!.id,
      translatorId: staff!.user.id,
      status: "ONGOING",
    },
  });

  return {
    getStaff: () => staff,
    getSecondStaff: () => staffSecond,
    getAdmin: () => admin,
    getReader: () => reader,
    getNovelByStaff: () => novelByStaff!,
    getNovelSecondByStaff: () => novelSecondByStaff!,
    getAuthor: () => author,
  };
};
