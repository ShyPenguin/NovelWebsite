import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.js";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.js";
import { UserTableSelect } from "@/infrastructure/db/schemas/users.js";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.js";
import { createUserTx } from "@/features/users/repositories/create.repository.js";
import data from "tests/mockdb.json" with { type: "json" };
import { testDb } from "tests/integrated/db/db-test.js";
import { userStaff } from "tests/mockdata.js";
import { createParsedNovel } from "tests/integrated/factory/create-parsed-novel.js";

export const seedBeforeAll = async () => {
  const search = "Reg";
  const staff: UserTableSelect = await createUserTx({
    tx: testDb,
    form: userStaff,
  });
  const author: AuthorTableSelect = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });

  const novels = await Promise.all(
    data.novels.map((novelData) =>
      createParsedNovel({
        novel: novelData as NovelTableInsert,
        authorId: author!.id,
        translatorId: staff!.id,
      }),
    ),
  );

  const sortedNovels = novels.sort((a, b) => a.title.localeCompare(b.title));

  const sortedRegNovels = sortedNovels
    .filter((novel) => novel.title.includes(search))
    .sort((a, b) => a.title.localeCompare(b.title));

  const novelFirstSearch = sortedRegNovels[0];
  const novelLastSearch = sortedRegNovels[sortedRegNovels.length - 1];

  return {
    getStaff: () => staff,
    getNovel: () => sortedNovels[0],
    getNovelLast: () => sortedNovels[sortedNovels.length - 1],
    getAuthor: () => author,
    getNovelFirstSearch: () => novelFirstSearch,
    getNovelLastSearch: () => novelLastSearch,
  };
};
