import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { seedBeforeAll } from "./seed.js";
import { randomUUID } from "crypto";
import { ChapterDetailSchema } from "@repo/contracts/schemas/chapter";
import { ChapterDetailDTO } from "@repo/contracts/dto/chapter";
import { app } from "@/app.js";

describe("Get chapters/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("Not found", async () => {
    const doesNotExist = 900;
    const novel = getters.getNovel();
    const res = await testApp
      .get(`/novels/${novel.id}/chapters/chapter-${doesNotExist}`)
      .expect(404);

    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: `/novels/${novel.id}/chapters/chapter-${doesNotExist}`,
        statusCode: 404,
        message: "Chapter not found",
      },
    });
  });

  it("Success on First chapter", async () => {
    const chapter = getters.getChapter();
    const novel = getters.getNovel();
    const prevChapter = null;
    const nextChapter = getters.getChapterSecond().id;

    const res = await testApp
      .get(`/novels/${novel.id}/chapters/chapter-${chapter.chapterNumber}`)
      .expect(200);

    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult.ok).toBe(true);
    if (!parsedResult.ok) throw Error();
    expect(parsedResult.data).toMatchObject({
      ...chapter,
      publishedAt: chapter.publishedAt!,
      prevChapter,
      nextChapter,
    } satisfies ChapterDetailDTO);
  });

  it("Success on Second chapter", async () => {
    const chapter = getters.getChapterSecond();
    const novel = getters.getNovel();

    const prevChapter = getters.getChapter().id;
    const nextChapter = getters.getChapterThird().id;

    const res = await testApp
      .get(`/novels/${novel.id}/chapters/chapter-${chapter.chapterNumber}`)
      .expect(200);

    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult.ok).toBe(true);
    if (!parsedResult.ok) throw Error();
    expect(parsedResult.data).toMatchObject({
      ...chapter,
      publishedAt: chapter.publishedAt!,
      prevChapter,
      nextChapter,
    } satisfies ChapterDetailDTO);
  });
  it("Success on Third chapter", async () => {
    const chapter = getters.getChapterThird();
    const prevChapter = getters.getChapterSecond().id;
    const nextChapter = null;

    const res = await testApp.get(`/chapters/${chapter.id}`).expect(200);

    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult.ok).toBe(true);
    if (!parsedResult.ok) throw Error();
    expect(parsedResult.data).toMatchObject({
      ...chapter,
      publishedAt: chapter.publishedAt!,
      prevChapter,
      nextChapter,
    } satisfies ChapterDetailDTO);
  });
});
