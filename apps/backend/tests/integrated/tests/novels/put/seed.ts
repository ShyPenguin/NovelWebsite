import { NovelFormDTO } from "@repo/contracts/dto/novel";
import data from "../../../../mockdb.json" with { type: "json" };
import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.ts";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.ts";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { upsertNovelCategoriesTx } from "@/features/categories/repository/upsert-novel-categories.ts";
import { testDb, redisDb } from "tests/integrated/db/db-test.ts";
import { mockCreateUserWithSessionGoogle } from "tests/integrated/factory/user/with-session.ts";
import {
  userStaff,
  userAdmin,
  readerFirst,
  userStaff2,
} from "tests/mockdata.ts";
import { createNovelTx } from "@/features/novels/repositories/create.repository.ts";
import { getNovelDetailByIdTx } from "@/features/novels/repositories/get-novel-by-id.repository.ts";
import { createCategoryTx } from "@/features/categories/repository/create.ts";

export const seedBeforeAll = async () => {
  const staff = await mockCreateUserWithSessionGoogle(
    userStaff,
    "1",
    testDb,
    redisDb,
  );
  const admin = await mockCreateUserWithSessionGoogle(
    userAdmin,
    "2",
    testDb,
    redisDb,
  );
  const reader = await mockCreateUserWithSessionGoogle(
    readerFirst,
    "3",
    testDb,
    redisDb,
  );
  const staffSecond = await mockCreateUserWithSessionGoogle(
    userStaff2,
    "4",
    testDb,
    redisDb,
  );

  const author: AuthorTableSelect = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });

  const authorSecond: AuthorTableSelect = await createAuthorTx({
    tx: testDb,
    form: data.authors[1],
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

  const novelByStaffInitial = await createNovelTx({
    tx: testDb,
    form: {
      ...(data.novels[0] as NovelTableInsert),
      authorId: author!.id,
      translatorId: staff!.user.id,
      status: "ONGOING",
    },
  });

  const novelSecondByStaffInitial = await createNovelTx({
    tx: testDb,
    form: {
      ...(data.novels[1] as NovelTableInsert),
      authorId: author!.id,
      translatorId: staff!.user.id,
      status: "ONGOING",
    },
  });

  // Categories of novel made by staff
  await upsertNovelCategoriesTx(testDb, novelByStaffInitial.id, [
    category.id,
    category2.id,
    category3.id,
  ]);

  // Categories of novel made by admin
  await upsertNovelCategoriesTx(testDb, novelSecondByStaffInitial.id, [
    category.id,
    category2.id,
  ]);

  const novelByStaff = await getNovelDetailByIdTx({
    tx: testDb,
    id: novelByStaffInitial.id,
  });

  const novelSecondByStaff = await getNovelDetailByIdTx({
    tx: testDb,
    id: novelSecondByStaffInitial.id,
  });

  const { coverImagePath, coverImageUrl, ...inputNovel } = {
    ...data.novels[2],
  };

  const finalInputNovel = {
    ...inputNovel,
    authorId: authorSecond!.id,
    categories: [category.id],
    schedule: ["TUE", "WED", "THU"],
    status: "ONGOING",
    language: "korean",
    type: "translated",
    release: "2002-07-31",
  } satisfies NovelFormDTO;

  const {
    coverImagePath: blank,
    coverImageUrl: blank2,
    ...inputNovel2
  } = {
    ...data.novels[3],
  };

  const finalInputNovel2 = {
    ...inputNovel2,
    authorId: author!.id,
    categories: [category.id],
    schedule: ["TUE", "WED"],
    status: "HIATUS",
    language: "english",
    type: "original",
    release: "2002-07-31",
  } satisfies NovelFormDTO;

  return {
    getStaff: () => staff,
    getStaffSecond: () => staffSecond,
    getAdmin: () => admin,
    getReader: () => reader,
    getNovelByStaff: () => novelByStaff!,
    getNovelSecondByStaff: () => novelSecondByStaff!,
    getInputNovel: () => finalInputNovel,
    getInputNovelSecond: () => finalInputNovel2,
    getAuthor: () => author,
    getAuthorSecond: () => authorSecond,
    getCategories: () => [category.id, category2.id, category3.id],
  };
};
