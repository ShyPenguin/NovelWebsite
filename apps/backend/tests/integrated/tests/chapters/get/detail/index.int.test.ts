import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../../../../../src/app.ts";
import { ApiResponseSchema } from "@repo/contracts/api";
import { seedBeforeAll } from "./seed.ts";
import { randomUUID } from "crypto";
import { ChapterDetailSchema } from "@repo/contracts/schemas/chapter";
import { ChapterDetailDTO } from "@repo/contracts/dto/chapter";

describe("Get chapters/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("Not found", async () => {
    const notRealId = randomUUID();
    const res = await testApp.get(`/chapters/${notRealId}`).expect(404);

    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: `/chapters/${notRealId}`,
        statusCode: 404,
        message: "Chapter not found",
      },
    });
  });

  it("Success on First chapter", async () => {
    const chapter = getters.getChapter();
    const prevChapter = null;
    const nextChapter = getters.getChapterSecond().id;

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

  it("Success on Second chapter", async () => {
    const chapter = getters.getChapterSecond();
    const prevChapter = getters.getChapter().id;
    const nextChapter = getters.getChapterThird().id;

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
