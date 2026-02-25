import { createAuthorTx } from "../../../../../src/repositories/authors/create.ts";
import {
  userStaff,
  userAdmin,
  readerFirst,
  userStaff2,
} from "../../../../mockdata.ts";
import { testDb, redisDb } from "../../../db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "../../../factory/user/with-session.ts";
import data from "../../../../mockdb.json" with { type: "json" };

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
