import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.ts";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.ts";
import { UserTableSelect } from "@/infrastructure/db/schemas/users.ts";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { createUserTx } from "@/features/users/repositories/create.ts";
import data from "tests/mockdb.json" with { type: "json" };
import { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";
import { testDb } from "tests/integrated/db/db-test.ts";
import { userStaff } from "tests/mockdata.ts";
import { createNovelTx } from "@/features/novels/repositories/create.repository.ts";
import { getNovelDetailByIdTx } from "@/features/novels/repositories/get-novel-by-id.repository.ts";
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
