import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { AuthorFormDTO } from "@repo/contracts/dto/author";
import { testDb, redisDb } from "tests/integrated/db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.ts";
import { userStaff, readerFirst } from "tests/mockdata.ts";
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
