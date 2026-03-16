import dotenv from "dotenv";
import { db } from "@/infrastructure/db/index.js";
import { ChapterTableInsert } from "@/infrastructure/db/schemas/chapters.js";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.js";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.js";
import { createUserTx } from "@/features/users/repositories/create.repository.js";
import data from "tests/mockdb.json" with { type: "json" };
import { createCategoryTx } from "@/features/categories/repository/create.js";
import { createNovelWithChapters } from "tests/integrated/factory/novel-with-chapters/index.js";
import { userAdmin, userStaff, userStaff2 } from "tests/mockdata.js";

dotenv.config({ path: ".env.dev" });
export const seed = async () => {
  console.log("seed");

  console.log("Creating Authors");
  const author = await createAuthorTx({
    tx: db,
    form: {
      name: data.authors[0].name,
    },
  });
  const author2 = await createAuthorTx({
    tx: db,
    form: {
      name: data.authors[1].name,
    },
  });
  await Promise.all(
    data["authors"].slice(2).map((author) => {
      return createAuthorTx({
        tx: db,
        form: author,
      });
    }),
  );
  console.log("Creating Users");
  const admin = await createUserTx({ tx: db, form: userAdmin });
  const staff = await createUserTx({ tx: db, form: userStaff });
  const staff2 = await createUserTx({ tx: db, form: userStaff2 });

  console.log("Creating categories...");
  const categories = await Promise.all(
    data.categories.map((category) => {
      return createCategoryTx({
        tx: db,
        form: category,
      });
    }),
  );

  console.log("Creating novels with chapters...");

  const novelsCreatedByStaff = await Promise.all(
    data.novels.slice(0, 3).map((novel) => {
      return createNovelWithChapters({
        tx: db,
        novel: novel as NovelTableInsert,
        authorId: author2.id,
        translatorId: staff.id,
        schedule: ["SUN", "WED", "THU"],
        categories: [
          categories[Math.floor(Math.random() * categories.length)].id,
          categories[Math.floor(Math.random() * categories.length)].id,
          categories[Math.floor(Math.random() * categories.length)].id,
        ],
        chapters: data.chapters
          .filter((chapter) => chapter.novel_id.includes(novel.title))
          .map((chapter) => {
            return {
              title: chapter.title,
              chapterNumber: chapter.chapterNumber,
              contentHtml: chapter.contentHtml,
              access: chapter.access ? "paid" : "free",
              publishedAt: new Date(chapter.publishedAt),
            };
          }) as Omit<ChapterTableInsert, "novelId" | "sourceDocUrl">[],
      });
    }),
  );

  const novelsCreatedByStaff2 = await Promise.all(
    data.novels.slice(4).map((novel) => {
      return createNovelWithChapters({
        tx: db,
        novel: novel as NovelTableInsert,
        authorId: author.id,
        translatorId: staff2.id,
        schedule: ["FRI", "MON", "WED"],
        categories: [
          categories[Math.floor(Math.random() * categories.length)].id,
          categories[Math.floor(Math.random() * categories.length)].id,
          categories[Math.floor(Math.random() * categories.length)].id,
        ],
        chapters: data.chapters
          .filter((chapter) => chapter.novel_id.includes(novel.title))
          .map((chapter) => {
            return {
              title: chapter.title,
              chapterNumber: chapter.chapterNumber,
              contentHtml: chapter.contentHtml,
              access: chapter.access ? "paid" : "free",
              publishedAt: new Date(chapter.publishedAt),
            };
          }) as Omit<ChapterTableInsert, "novelId" | "sourceDocUrl">[],
      });
    }),
  );

  const novelsCreatedByAdmin = await createNovelWithChapters({
    tx: db,
    novel: data.novels[3] as NovelTableInsert,
    authorId: author.id,
    translatorId: admin.id,
    schedule: ["FRI", "SAT", "SUN"],
    categories: [
      categories[Math.floor(Math.random() * categories.length)].id,
      categories[Math.floor(Math.random() * categories.length)].id,
      categories[Math.floor(Math.random() * categories.length)].id,
    ],
    chapters: data.chapters
      .filter((chapter) => chapter.novel_id.includes(data.novels[3].title))
      .map((chapter) => {
        return {
          title: chapter.title,
          chapterNumber: chapter.chapterNumber,
          contentHtml: chapter.contentHtml,
          access: chapter.access ? "paid" : "free",
          publishedAt: new Date(chapter.publishedAt),
        };
      }) as Omit<ChapterTableInsert, "novelId" | "sourceDocUrl">[],
  });
};

await seed();
