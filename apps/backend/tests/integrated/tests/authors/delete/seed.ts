import { createAuthorTx } from "../../../../../src/repositories/authors/create.ts";
import { userStaff, userAdmin, readerFirst } from "../../../../mockdata.ts";
import { testDb, redisDb } from "../../../db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "../../../factory/user/with-session.ts";
import data from "../../../../mockdb.json" with { type: "json" };
import { createNovelTx } from "../../../../../src/repositories/novels/create.ts";
import { NovelTableInsert } from "../../../../../src/db/schemas/novels.ts";

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
