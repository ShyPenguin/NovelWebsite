import { UserChangeRoleDTO } from "@repo/contracts/dto/user";
import { testDb, redisDb } from "tests/integrated/db/db-test.js";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.js";
import {
  userStaff,
  userAdmin,
  userStaff2,
  userSupervisor,
} from "tests/mockdata.js";

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
    role: "supervisor",
  } satisfies UserChangeRoleDTO;

  return {
    getStaff: () => staff,
    getStaffSecond: () => staffSecond,
    getSupervisor: () => supervisor,
    getAdmin: () => admin,
    getInput: () => input,
  };
};
