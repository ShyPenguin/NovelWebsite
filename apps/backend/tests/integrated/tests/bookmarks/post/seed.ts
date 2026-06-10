import { createAuthorTx } from "@/features/authors/repositories/create.repository.js";
import { createUserTx } from "@/features/users/repositories/create.repository.js";
import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.js";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.js";
import { UserTableSelect } from "@/infrastructure/db/schemas/users.js";
import { redisDb, testDb } from "tests/integrated/db/db-test.js";
import { createParsedNovel } from "tests/integrated/factory/create-parsed-novel.js";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.js";
import { readerFirst, userStaff } from "tests/mockdata.js";
import data from "tests/mockdb.json" with { type: "json" };

export const seedBeforeAll = async () => {
  const staff: UserTableSelect = await createUserTx({
    tx: testDb,
    form: userStaff,
  });
  const author: AuthorTableSelect = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });

  const novels = await Promise.all(
    data.novels.map((novelData) =>
      createParsedNovel({
        novel: novelData as NovelTableInsert,
        authorId: author!.id,
        translatorId: staff!.id,
      }),
    ),
  );

  const user = await mockCreateUserWithSessionGoogle(
    readerFirst,
    "1",
    testDb,
    redisDb,
  );

  return {
    getUser: () => user,
    getNovel: () => novels[0],
    getTranslator: () => staff,
  };
};
