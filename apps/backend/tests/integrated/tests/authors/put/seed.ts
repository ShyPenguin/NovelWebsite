import { createAuthorTx } from "@/features/authors/repositories/create.repository.js";
import { testDb, redisDb } from "tests/integrated/db/db-test.js";
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

  const dataToUpdate = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });

  const seededData = await createAuthorTx({
    tx: testDb,
    form: data.authors[1],
  });
  return {
    getDataToUpdate: () => dataToUpdate,
    getDataSeeded: () => seededData,
    getReader: () => reader,
    getStaff: () => staff,
    getStaffSecond: () => staffSecond,
    getAdmin: () => admin,
  };
};
