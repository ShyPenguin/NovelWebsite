import { describe, it, expect, beforeAll } from "vitest";
import { seedBeforeAll } from "./seed.ts";
import request from "supertest";
import { app } from "../../../../../../src/app.ts";
import { ApiResponseSchema } from "@repo/contracts/api";
import {
  ArrayChapterThumbnailSchema,
  PaginatedChapterThumbnailSchema,
} from "@repo/contracts/schemas/chapter";
import { randomUUID } from "crypto";
import { ChapterQueryInput } from "../../../../../../src/validations/ChapterValidator.ts";

describe(" GET /novels/:id/chapters", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("Not found", async () => {
    const notRealId = randomUUID();
    const res = await testApp.get(`/novels/${notRealId}/chapters`).expect(404);

    const parsedResult = ApiResponseSchema(ArrayChapterThumbnailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: `/novels/${notRealId}/chapters`,
        statusCode: 404,
        message: "Novel not found",
      },
    });
  });

  describe("Query, Sorting, & pagination behavior", () => {
    it("filters by search, returns an array", async () => {
      const novel = getters.getNovel();
      const chapter = getters.getChapter();

      const res = await testApp
        .get(`/novels/${novel.id}/chapters`)
        .query({ search: "1" } satisfies ChapterQueryInput);

      const parsedResult = ApiResponseSchema(ArrayChapterThumbnailSchema).parse(
        res.body,
      );

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      expect(Array.isArray(parsedResult.data)).toBe(true);
      expect(parsedResult.data.length).toBe(20);
      expect(parsedResult.data[0]).toMatchObject({
        id: chapter.id,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        access: chapter.access,
        status: chapter.status,
        publishedAt: new Date(chapter.publishedAt!.toISOString()),
      });
    });

    it("filters by search 1, sort desc, returns an array", async () => {
      const novel = getters.getNovel();
      const chapter = getters.getChapterLast();

      const res = await testApp
        .get(`/novels/${novel.id}/chapters`)
        .query({
          search: "1",
          sort: "desc(chapterNumber)",
        } satisfies ChapterQueryInput);

      const parsedResult = ApiResponseSchema(ArrayChapterThumbnailSchema).parse(
        res.body,
      );

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      expect(Array.isArray(parsedResult.data)).toBe(true);
      expect(parsedResult.data.length).toBe(20);
      expect(parsedResult.data[0]).toMatchObject({
        id: chapter.id,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        access: chapter.access,
        status: chapter.status,
        publishedAt: new Date(chapter.publishedAt!.toISOString()),
      });
    });

    it("returns empty array when no match", async () => {
      const novel = getters.getNovel();

      const res = await testApp
        .get(`/novels/${novel.id}/chapters`)
        .query({ search: "BLAJBJLABJ" });

      const parsedResult = ApiResponseSchema(ArrayChapterThumbnailSchema).parse(
        res.body,
      );

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data!;
      expect(Array.isArray(resultData)).toBe(true);
      expect(resultData.length).toBe(0);
    });

    it("paginates correctly", async () => {
      const novel = getters.getNovel();
      const chapter = getters.getChapter();

      const res = await testApp
        .get(`/novels/${novel.id}/chapters`)
        .query({ page: 1, pageSize: 30 } satisfies ChapterQueryInput);

      const parsedResult = ApiResponseSchema(
        PaginatedChapterThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const data = parsedResult.data;
      expect(data.items.length).toBe(30);
      expect(data.currentPage).toBe(1);
      expect(data.totalPage).toBe(4);

      const chapterThumbnail = data.items[0];

      expect(chapterThumbnail).toMatchObject({
        id: chapter.id,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        access: chapter.access,
        status: chapter.status,
        publishedAt: new Date(chapter.publishedAt!.toISOString()),
      });
    });

    it("paginates 2nd page correctly", async () => {
      const novel = getters.getNovel();

      const res = await testApp
        .get(`/novels/${novel.id}/chapters`)
        .query({ page: 2, pageSize: 30 } satisfies ChapterQueryInput);

      const parsedResult = ApiResponseSchema(
        PaginatedChapterThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data!;
      expect(resultData.items.length).toBe(30);
      expect(resultData.currentPage).toBe(2);
      expect(resultData.totalPage).toBe(4);
    });

    it("paginates returns empty array, from search 'bla bla bla' page 1, total 0", async () => {
      const novel = getters.getNovel();

      const res = await testApp
        .get(`/novels/${novel.id}/chapters`)
        .query({
          search: "bla bla bla",
          page: 1,
          pageSize: 30,
        } satisfies ChapterQueryInput);

      const parsedResult = ApiResponseSchema(
        PaginatedChapterThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data!;
      expect(resultData.items.length).toBe(0);
      expect(resultData.currentPage).toBe(1);
      expect(resultData.totalPage).toBe(0);
    });

    it("paginates returns empty array, from page 5, total page 4", async () => {
      const novel = getters.getNovel();

      const res = await testApp
        .get(`/novels/${novel.id}/chapters`)
        .query({ page: 5, pageSize: 30 } satisfies ChapterQueryInput);
      const parsedResult = ApiResponseSchema(
        PaginatedChapterThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data!;
      expect(resultData.items.length).toBe(0);
      expect(resultData.currentPage).toBe(5);
      expect(resultData.totalPage).toBe(4);
    });
  });
});
