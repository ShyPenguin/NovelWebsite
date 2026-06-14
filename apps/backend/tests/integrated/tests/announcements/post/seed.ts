import { createAnnouncementTx } from "@/features/announcements/repositories/create.repository.js";
import { AnnouncementFormDTO } from "@repo/contracts/dto/announcement";
import { testDb, redisDb } from "tests/integrated/db/db-test.js";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.js";
import { userAdmin, readerFirst } from "tests/mockdata.js";
import data from "tests/mockdb.json" with { type: "json" };

export const seedBeforeAll = async () => {
  const admin = await mockCreateUserWithSessionGoogle(
    userAdmin,
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

  const seededData = await createAnnouncementTx({
    tx: testDb,
    form: { ...data.announcements[0], authorId: admin.user.id },
  });
  const inputData = {
    title: "Roar",
    content: "ROARRRRRR",
  } satisfies AnnouncementFormDTO;

  return {
    getDataInput: () => inputData,
    getDataSeeded: () => seededData,
    getReader: () => reader,
    getAdmin: () => admin,
  };
};
