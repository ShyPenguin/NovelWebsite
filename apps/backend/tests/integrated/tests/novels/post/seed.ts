import { redisDb, testDb } from "../../../db/db-test.ts";
import { readerFirst, userStaff } from "../../../../mockdata.ts";
import { createNovelTx } from "../../../../../src/repositories/novels/create.ts";
import { NovelTableInsert } from "../../../../../src/db/schemas/novels.ts";
import data from "../../../../mockdb.json" with { type: "json" };
import { AuthorTableSelect } from "../../../../../src/db/schemas/authors.ts";
import { createAuthorTx } from "../../../../../src/repositories/authors/create.ts";
import { createCategoryTx } from "../../../../../src/repositories/categories/create.ts";
import { upsertNovelCategoriesTx } from "../../../../../src/repositories/novelCategories/upsertNovelCategories.ts";
import { mockCreateUserWithSessionGoogle } from "../../../factory/user/with-session.ts";

export const seedBeforeAll = async () => {
  const staff = await mockCreateUserWithSessionGoogle(
    userStaff,
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

  const author: AuthorTableSelect = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });

  const category = await createCategoryTx({
    tx: testDb,
    form: data.categories[0],
  });
  const category2 = await createCategoryTx({
    tx: testDb,
    form: data.categories[1],
  });
  const category3 = await createCategoryTx({
    tx: testDb,
    form: data.categories[2],
  });

  const novelResult = await createNovelTx({
    tx: testDb,
    form: {
      ...(data.novels[0] as NovelTableInsert),
      authorId: author!.id,
      translatorId: staff!.user.id,
      status: "ONGOING",
    },
  });

  await upsertNovelCategoriesTx(testDb, novelResult.id, [
    category.id,
    category2.id,
    category3.id,
  ]);

  // Remove Cover Image since novel's cover have their own path
  const { coverImagePath, coverImageUrl, ...inputNovel } = {
    ...data.novels[1],
  };

  const finalInputNovel = {
    ...inputNovel,
    authorId: author!.id,
    categories: [category.id],
    schedule: ["TUE", "WED", "THU"],
    status: "ONGOING", // Default
    language: "korean", // Default
    type: "translated", // Default
  };
  return {
    getStaff: () => staff,
    getReader: () => reader,
    getSeededNovel: () => novelResult,
    getInputNovel: () => finalInputNovel,
    getAuthor: () => author,
    getCategories: () => [category.id, category2.id, category3.id],
  };
};
