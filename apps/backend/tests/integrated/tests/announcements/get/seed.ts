import { createAnnouncementTx } from "@/features/announcements/repositories/create.repository.js";
import { getAnnouncementDetailByIdTx } from "@/features/announcements/repositories/get-announcement-one.repository.js";
import { redisDb, testDb } from "tests/integrated/db/db-test.js";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.js";
import { userAdmin } from "tests/mockdata.js";
import data from "tests/mockdb.json" with { type: "json" };

export const seedBeforeAll = async () => {
  // 6 total in Announcements

  const admin = await mockCreateUserWithSessionGoogle(
    userAdmin,
    "1",
    testDb,
    redisDb,
  );

  const query = "Knick";
  const searchedAnnouncements = data.announcements.filter((announcement) =>
    announcement.title.includes(query),
  );
  const notSearchedAnnouncements = data.announcements.filter(
    (announcement) => !announcement.title.includes(query),
  );
  const announcement = await createAnnouncementTx({
    tx: testDb,
    form: {
      ...searchedAnnouncements[0],
      authorId: admin.user.id,
    },
  });

  await Promise.all(
    notSearchedAnnouncements.map((announcement) =>
      createAnnouncementTx({
        tx: testDb,
        form: {
          ...announcement,
          authorId: admin.user.id,
        },
      }),
    ),
  );

  return {
    getAnnouncement: () => announcement!,
    getCreator: () => admin.user,
    getQuery: () => query,
  };
};
