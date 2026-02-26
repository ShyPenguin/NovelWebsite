import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.ts";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.ts";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { upsertNovelCategoriesTx } from "@/features/categories/repository/upsert-novel-categories.ts";
import { testDb, redisDb } from "tests/integrated/db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.ts";
import { userStaff, readerFirst } from "tests/mockdata.ts";
import data from "../../../../mockdb.json" with { type: "json" };
import { createNovelTx } from "@/features/novels/repositories/create.repository.ts";
import { createCategoryTx } from "@/features/categories/repository/create.ts";

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
