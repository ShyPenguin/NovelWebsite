import { createAuthorTx } from "@/features/authors/repositories/create.repository.js";
import { createBookmarkTx } from "@/features/bookmarks/repositories/create.repository.js";
import { createUserTx } from "@/features/users/repositories/create.repository.js";
import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.js";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.js";
import { UserTableSelect } from "@/infrastructure/db/schemas/users.js";
import { redisDb, testDb } from "tests/integrated/db/db-test.js";
import { createParsedNovel } from "tests/integrated/factory/create-parsed-novel.js";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.js";
import { readerFirst, userAdmin, userStaff } from "tests/mockdata.js";
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

  const bookmarkedNovels = novels.slice(0, 4);
  await Promise.all(
    bookmarkedNovels.map((novel) =>
      createBookmarkTx({
        tx: testDb,
        form: {
          novelId: novel.id,
          userId: user.user.id,
        },
      }),
    ),
  );

  const otherUser = await mockCreateUserWithSessionGoogle(
    userAdmin,
    "2",
    testDb,
    redisDb,
  );

  return {
    getUser: () => user,
    getOtherUser: () => otherUser,
    getBookmarks: () => bookmarkedNovels,
    getTranslator: () => staff,
  };
};
