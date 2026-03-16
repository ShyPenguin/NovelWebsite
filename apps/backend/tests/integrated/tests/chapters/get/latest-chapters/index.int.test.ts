import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { ApiResponseSchema, GetNovelLatestChapters } from "@repo/contracts/api";
import { seedBeforeAll } from "./seed.js";
import { app } from "@/app.js";

describe("Get chapters/allLatestChapters", () => {
  const testApp = request(app);

  it("Empty array", async () => {
    const res = await testApp.get(`/chapters/allLatestChapters`).expect(200);

    const parsedResult = ApiResponseSchema(GetNovelLatestChapters).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: true,
      data: {
        free: [],
        paid: [],
      },
    });
  });

  it("returns free and paid chapters, sorted desc(udpatedAt)", async () => {
    const getters = await seedBeforeAll();
    const res = await testApp.get(`/chapters/allLatestChapters`).expect(200);

    const parsedResult = ApiResponseSchema(GetNovelLatestChapters).parse(
      res.body,
    );
    expect(parsedResult.ok).toBe(true);
    if (!parsedResult.ok) throw new Error(parsedResult.error.message);

    expect(Array.isArray(parsedResult.data.free)).toBe(true);
    expect(Array.isArray(parsedResult.data.paid)).toBe(true);

    const novel = getters.getNovel();

    const resultFreeChapter = parsedResult.data.free[0];
    const freeChapter = getters.getFreeChapter();

    expect(resultFreeChapter).toMatchObject({
      novel: {
        id: novel.id,
        title: novel.title,
        coverImageUrl: novel.coverImageUrl,
      },
      id: freeChapter.id,
      chapterNumber: freeChapter.chapterNumber,
      title: freeChapter.title,
      access: freeChapter.access,
      status: freeChapter.status,
      updatedAt: freeChapter.updatedAt,
    });

    const resultPaidChapter = parsedResult.data.paid[0];
    const paidChapter = getters.getPaidChapter();
    expect(resultPaidChapter).toMatchObject({
      novel: {
        id: novel.id,
        title: novel.title,
        coverImageUrl: novel.coverImageUrl,
      },
      id: paidChapter.id,
      chapterNumber: paidChapter.chapterNumber,
      title: paidChapter.title,
      access: paidChapter.access,
      status: paidChapter.status,
      updatedAt: paidChapter.updatedAt,
    });
  });
});
