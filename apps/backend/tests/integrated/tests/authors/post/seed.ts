import { mockCreateUserWithSessionGoogle } from "../../../factory/user/with-session.ts";
import { redisDb, testDb } from "../../../db/db-test.ts";
import { readerFirst, userStaff } from "../../../../mockdata.ts";
import { AuthorFormDTO } from "@repo/contracts/dto/author";
import { createAuthorTx } from "../../../../../src/repositories/authors/create.ts";
import data from "../../../../mockdb.json" with { type: "json" };

export const seedBeforeAll = async () => {
  const staff = await mockCreateUserWithSessionGoogle(
    userStaff,
    "1",
    testDb,
    redisDb,
  );
  const reader = await mockCreateUserWithSessionGoogle(
    readerFirst,
    "2",
    testDb,
    redisDb,
  );

  const seededData = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });
  const inputData = {
    name: "Jawad",
  } satisfies AuthorFormDTO;

  return {
    getDataInput: () => inputData,
    getDataSeeded: () => seededData,
    getReader: () => reader,
    getStaff: () => staff,
  };
};
