import { createAuthorTx } from "../../../../../src/repositories/authors/create.ts";
import {
  createNovelTx,
  getNovelDetailByIdTx,
} from "../../../../../src/repositories/novels/index.ts";
import { createUserTx } from "../../../../../src/repositories/users/create.ts";
import { userStaff } from "../../../../mockdata.ts";
import data from "../../../../mockdb.json" with { type: "json" };
import { testDb } from "../../../db/db-test.ts";
import {
  AuthorTableSelect,
  NovelTableInsert,
  UserTableSelect,
} from "../../../../../src/db/schemas/index.ts";
import { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";

const createParsedNovel = async ({
  novel,
  authorId,
  translatorId,
}: {
  novel: NovelTableInsert;
  authorId: string;
  translatorId: string;
}): Promise<NovelDetailDTO> => {
  const novelRegResult = await createNovelTx({
    tx: testDb,
    form: {
      ...novel,
      authorId,
      translatorId,
    },
  });

  const getRegResult = await getNovelDetailByIdTx({
    tx: testDb,
    id: novelRegResult.id || "",
  });
  return NovelDetailSchema.parse(getRegResult);
};
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
