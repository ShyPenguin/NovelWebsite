import "dotenv/config";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.js";
import { db } from "@/infrastructure/db/index.js";
import data from "tests/mockdb.json" with { type: "json" };
import { createUserTx } from "@/features/users/repositories/create.repository.js";
import { userAdmin } from "tests/mockdata.js";
import { createCategoryTx } from "@/features/categories/repository/create.js";
import { ChapterTableInsert } from "@/infrastructure/db/schemas/chapters.js";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.js";
import { createNovelWithChapters } from "tests/integrated/factory/novel-with-chapters/index.js";

const stageNovels = data.novels.map((novel) => {
  return {
    ...novel,
    coverImageUrl: `${process.env.SUPABASE_URL}/${process.env.PUBLIC_BUCKET}/${novel.coverImagePath}`,
  };
});

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

  console.log("Creating categories...");
  const categories = await Promise.all(
    data.categories.map((category) => {
      return createCategoryTx({
        tx: db,
        form: category,
      });
    }),
  );

  await Promise.all(
    stageNovels.map((novel) => {
      return createNovelWithChapters({
        tx: db,
        novel: {
          ...novel,
          coverImageUrl: `${process.env.STORAGE_PUBLIC_DOMAIN}/${process.env.PUBLIC_BUCKET}/${novel.coverImagePath}`,
        } as NovelTableInsert,
        authorId: Math.floor(Math.random() * 2) == 1 ? author2.id : author.id,
        translatorId: admin.id,
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
};

await seed();
