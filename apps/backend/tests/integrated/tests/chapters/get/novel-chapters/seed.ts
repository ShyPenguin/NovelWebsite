import { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";
import { getFormattedDate } from "@repo/contracts/utils/getFormattedDate";
import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { NovelTableInsert } from "@/infrastructure/db/schemas/novels.ts";
import { UserTableSelect } from "@/infrastructure/db/schemas/users.ts";
import { createUserTx } from "@/features/users/repositories/create.repository.ts";
import { testDb } from "tests/integrated/db/db-test.ts";
import { userStaff } from "tests/mockdata.ts";
import { AuthorTableSelect } from "@/infrastructure/db/schemas/authors.ts";
import data from "tests/mockdb.json" with { type: "json" };
import { createNovelTx } from "@/features/novels/repositories/create.repository.ts";
import { getNovelDetailByIdTx } from "@/features/novels/repositories/get-novel-by-id.repository.ts";
import { createChapterTx } from "@/features/chapters/repositories/create.repository.ts";

export const seedBeforeAll = async () => {
  const staff: UserTableSelect = await createUserTx({
    tx: testDb,
    form: userStaff,
  });
  const author: AuthorTableSelect = await createAuthorTx({
    tx: testDb,
    form: data.authors[0],
  });
  const novelResult = await createNovelTx({
    tx: testDb,
    form: {
      ...(data.novels[0] as NovelTableInsert),
      authorId: author!.id,
      translatorId: staff!.id,
    },
  });

  const getResult = await getNovelDetailByIdTx({
    tx: testDb,
    id: novelResult.id,
  });
  const novel: NovelDetailDTO = NovelDetailSchema.parse(getResult);

  const filteredChapters = data.chapters.filter((chapter) =>
    chapter.novel_id.includes("Omniscient Reader's Viewpoint"),
  );

  const chapter = await createChapterTx({
    tx: testDb,
    form: {
      novelId: novel.id,
      title: filteredChapters[0].title,
      chapterNumber: filteredChapters[0].chapterNumber,
      contentHtml: filteredChapters[0].contentHtml,
      sourceDocUrl:
        "https://docs.google.com/document/d/1hPxEP32WViJX0e5dQtmSKRS02996ghkQugCXG4s8u1s/edit?tab=t.0",
      access: filteredChapters[0].access ? "paid" : "free",
      publishedAt: new Date(
        getFormattedDate(new Date(filteredChapters[0].publishedAt)),
      ),
      updatedAt: new Date(filteredChapters[0].publishedAt),
    },
  });

  const chapterLast = await createChapterTx({
    tx: testDb,
    form: {
      novelId: novel.id,
      title: filteredChapters[filteredChapters.length - 1].title,
      chapterNumber:
        filteredChapters[filteredChapters.length - 1].chapterNumber,
      contentHtml: filteredChapters[filteredChapters.length - 1].contentHtml,
      sourceDocUrl:
        "https://docs.google.com/document/d/1hPxEP32WViJX0e5dQtmSKRS02996ghkQugCXG4s8u1s/edit?tab=t.0",
      access: filteredChapters[filteredChapters.length - 1].access
        ? "paid"
        : "free",
      publishedAt: new Date(
        getFormattedDate(
          new Date(filteredChapters[filteredChapters.length - 1].publishedAt),
        ),
      ),
    },
  });

  await Promise.all(
    filteredChapters.slice(1, filteredChapters.length - 1).map((chapter) =>
      createChapterTx({
        tx: testDb,
        form: {
          novelId: novel.id,
          title: chapter.title,
          chapterNumber: chapter.chapterNumber,
          contentHtml: chapter.contentHtml,
          sourceDocUrl:
            "https://docs.google.com/document/d/1hPxEP32WViJX0e5dQtmSKRS02996ghkQugCXG4s8u1s/edit?tab=t.0",
          access: chapter.access ? "paid" : "free",
          publishedAt: new Date(
            getFormattedDate(new Date(chapter.publishedAt)),
          ),
        },
      }),
    ),
  );

  return {
    getStaff: () => staff,
    getNovel: () => novel,
    getAuthor: () => author,
    getChapter: () => chapter,
    getChapterLast: () => chapterLast,
  };
};
