import { createAuthorTx } from "@/features/authors/repositories/create.repository.js";
import { AuthorFormDTO } from "@repo/contracts/dto/author";
import { testDb, redisDb } from "tests/integrated/db/db-test.js";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.js";
import { userStaff, readerFirst } from "tests/mockdata.js";
import data from "tests/mockdb.json" with { type: "json" };

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
