import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { createNovelTx } from "@/features/novels/repositories/create.repository.ts";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.ts";
import { redisDb, testDb } from "tests/integrated/db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.ts";
import { userStaff } from "tests/mockdata.ts";
import data from "tests/mockdb.json" with { type: "json" };

export const seedBeforeAll = async () => {
  // 14 total in Authors
  const sortedAuthors = data.authors.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const staff = await mockCreateUserWithSessionGoogle(
    userStaff,
    "1",
    testDb,
    redisDb,
  );

  const authors = await Promise.all(
    sortedAuthors.map((author) =>
      createAuthorTx({
        tx: testDb,
        form: author,
      }),
    ),
  );

  const novels = await Promise.all(
    data.novels.slice(0, 4).map((novel) =>
      createNovelTx({
        tx: testDb,
        form: {
          ...(novel as NovelTableInsert),
          authorId: authors[0]!.id,
          translatorId: staff!.user.id,
          status: "ONGOING",
        },
      }),
    ),
  );
  const searchedAuthors = authors.filter((author) =>
    author.name.includes("Cu"),
  );
  return {
    getAuthor: () => authors[0],
    getSearchedAuthor: () => searchedAuthors,
    getNovels: () => novels,
  };
};
