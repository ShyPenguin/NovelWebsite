import { UserFormDTO } from "@repo/contracts/dto/user";
import { testDb, redisDb } from "tests/integrated/db/db-test.js";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.js";
import {
  userStaff,
  userAdmin,
  userStaff2,
  userSupervisor,
} from "tests/mockdata.js";

// One Authentication Error
// One Authorization Error Due to Managing User with Higher Role
// One Authorization Error Due To Resource Role
// One Validation Error
// One Validation Error Username is arleady taken
// One NotFound Error
// Success

export const seedBeforeAll = async () => {
  const staff = await mockCreateUserWithSessionGoogle(
    userStaff,
    "1",
    testDb,
    redisDb,
  );
  const staffSecond = await mockCreateUserWithSessionGoogle(
    userStaff2,
    "2",
    testDb,
    redisDb,
  );
  const supervisor = await mockCreateUserWithSessionGoogle(
    userSupervisor,
    "3",
    testDb,
    redisDb,
  );
  const admin = await mockCreateUserWithSessionGoogle(
    userAdmin,
    "4",
    testDb,
    redisDb,
  );

  const input = {
    name: "Mon",
  } satisfies UserFormDTO;

  return {
    getStaff: () => staff,
    getStaffSecond: () => staffSecond,
    getSupervisor: () => supervisor,
    getAdmin: () => admin,
    getInput: () => input,
  };
};
