import { testDb, redisDb } from "tests/integrated/db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.ts";
import { userAdmin, userSupervisor, userSupervisor2 } from "tests/mockdata.ts";

export const seedBeforeAll = async () => {
  const supervisorToDelete = await mockCreateUserWithSessionGoogle(
    userSupervisor,
    "1",
    testDb,
    redisDb,
  );
  const supervisor = await mockCreateUserWithSessionGoogle(
    userSupervisor2,
    "2",
    testDb,
    redisDb,
  );
  const admin = await mockCreateUserWithSessionGoogle(
    userAdmin,
    "3",
    testDb,
    redisDb,
  );

  return {
    getSupervisorToDelete: () => supervisorToDelete,
    getSupervisor: () => supervisor,
    getAdmin: () => admin,
  };
};
