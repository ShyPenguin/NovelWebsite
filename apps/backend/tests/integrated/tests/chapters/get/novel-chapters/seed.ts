import { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";
import { AuthorTableSelect } from "../../../../../../src/db/schemas/authors.ts";
import {
  UserTableSelect,
  NovelTableInsert,
} from "../../../../../../src/db/schemas/index.ts";
import { createAuthorTx } from "../../../../../../src/repositories/authors/create.ts";
import { createNovelTx } from "../../../../../../src/repositories/novels/create.ts";
import { getNovelDetailByIdTx } from "../../../../../../src/repositories/novels/getNovelById.ts";
import { createUserTx } from "../../../../../../src/repositories/users/create.ts";
import { testDb } from "../../../../db/db-test.ts";
import { userStaff } from "../../../../../mockdata.ts";
import data from "../../../../../mockdb.json" with { type: "json" };
import { createChapterTx } from "../../../../../../src/repositories/chapters/create.ts";
import { getFormattedDate } from "@repo/contracts/utils/getFormattedDate";

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
