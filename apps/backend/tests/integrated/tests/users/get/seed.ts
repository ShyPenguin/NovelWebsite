import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { createNovelTx } from "@/features/novels/repositories/create.repository.ts";
import { createUserTx } from "@/features/users/repositories/create.repository.ts";
import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.ts";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.ts";
import { UserTableInsert } from "@/infrastructure/db/schemas/users.ts";
import { UserThumbnailDTO } from "@repo/contracts/dto/user";
import { testDb } from "tests/integrated/db/db-test.ts";
import { userAdmin } from "tests/mockdata.ts";
import data from "tests/mockdb.json" with { type: "json" };

export const seedBeforeAll = async () => {
  const admin = await createUserTx({
    tx: testDb,
    form: userAdmin,
  });
  const author: AuthorTableSelect = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });

  const novels = await Promise.all(
    data.novels.map((novel) =>
      createNovelTx({
        tx: testDb,
        form: {
          ...(novel as NovelTableInsert),
          authorId: author!.id,
          translatorId: admin!.id,
        },
      }),
    ),
  );

  const novel = {
    id: novels[0].id,
    title: novels[0].title,
    coverImageUrl: novels[0].coverImageUrl,
    description: novels[0].description,
  };

  const users = await Promise.all(
    data.users.map((user) =>
      createUserTx({
        tx: testDb,
        form: user as UserTableInsert,
      }),
    ),
  );

  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
  const firstUser = {
    ...sortedUsers[0],
    oAuthProviders: [],
  } satisfies UserThumbnailDTO;
  return {
    getAdmin: () => admin,
    getNovel: () => novel,
    getFirstUser: () => firstUser,
    getUsersCount: () => sortedUsers.length + 1,
  };
};
