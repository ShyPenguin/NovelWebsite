import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.ts";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { createNovelTx } from "@/features/novels/repositories/create.repository.ts";
import { testDb, redisDb } from "tests/integrated/db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.ts";
import { userStaff, userAdmin, readerFirst } from "tests/mockdata.ts";
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

  const dataToDeleteStaff = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });

  const dataToDeleteAdmin = await createAuthorTx({
    tx: testDb,
    form: data.authors[1],
  });

  const novels = await Promise.all(
    data.novels.slice(0, 4).map((novel) =>
      createNovelTx({
        tx: testDb,
        form: {
          ...(novel as NovelTableInsert),
          authorId: dataToDeleteStaff!.id,
          translatorId: staff!.user.id,
          status: "ONGOING",
        },
      }),
    ),
  );

  return {
    getStaff: () => staff,
    getAdmin: () => admin,
    getReader: () => reader,
    getDataToDelete: () => dataToDeleteStaff,
    getDataToDeleteAdmin: () => dataToDeleteAdmin,
    getNovels: () => novels,
  };
};
