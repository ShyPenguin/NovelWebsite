import { NovelFormDTO } from "@repo/contracts/dto/novel";
import { AuthorTableSelect } from "../../../../../src/db/schemas/authors.ts";
import { NovelTableInsert } from "../../../../../src/db/schemas/novels.ts";
import { createAuthorTx } from "../../../../../src/repositories/authors/create.ts";
import { createNovelTx } from "../../../../../src/repositories/novels/create.ts";
import { redisDb, testDb } from "../../../db/db-test.ts";
import {
  readerFirst,
  userAdmin,
  userStaff,
  userStaff2,
} from "../../../../mockdata.ts";
import data from "../../../../mockdb.json" with { type: "json" };
import { mockCreateUserWithSessionGoogle } from "../../../factory/user/with-session.ts";

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

  const novelByStaff = await createNovelTx({
    tx: testDb,
    form: {
      ...(data.novels[0] as NovelTableInsert),
      authorId: author!.id,
      translatorId: staff!.user.id,
      status: "ONGOING",
    },
  });

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
