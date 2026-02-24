import {
  userStaff,
  userAdmin,
  readerFirst,
  userStaff2,
} from "../../../../mockdata";
import { testDb, redisDb } from "../../../db/db-test";
import { mockCreateUserWithSessionGoogle } from "../../../factory/user/with-session";

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
};
