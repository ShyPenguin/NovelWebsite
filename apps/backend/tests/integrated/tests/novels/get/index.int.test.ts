import { describe, it, expect, beforeAll } from "vitest";
import { seedBeforeAll } from "./seed.js";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import {
  ArrayNovelThumbnailSchema,
  NovelDetailSchema,
  NovelThumbnailSchema,
  NovelTrendSchema,
  PaginatedNovelDetailSchema,
  PaginatedNovelThumbnailSchema,
  PaginatedNovelTrendSchema,
} from "@repo/contracts/schemas/novel";
import { randomUUID } from "crypto";
import { app } from "@/app.js";
import { NovelQueryInput } from "@/features/novels/novel.schema.js";

describe("GET /novels", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  describe("Get novel by Id", () => {
    it("Success", async () => {
      const novel = getters.getNovel();

      const res = await testApp.get(`/novels/${novel.id}`).expect(200);

      const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw Error();
      expect(parsedResult.data).toMatchObject(novel);
    });

    it("Not found", async () => {
      const notRealId = randomUUID();
      const res = await testApp.get(`/novels/${notRealId}`).expect(404);

      const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "NotFoundError",
          path: `/novels/${notRealId}`,
          statusCode: 404,
          message: "Novel not found",
        },
      });
    });
  });

  describe("Query, Sorting,& pagination behavior", () => {
    it("filters by search, returns an array", async () => {
      const novel = getters.getNovelLastSearch();

      const res = await testApp
        .get(`/novels/thumbnail`)
        .query({ search: "Reg" } satisfies NovelQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(ArrayNovelThumbnailSchema).parse(
        res.body,
      );

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      expect(Array.isArray(parsedResult.data)).toBe(true);
      expect(parsedResult.data.length).toBe(4);
      expect(parsedResult.data[0]).toMatchObject(
        NovelThumbnailSchema.parse(novel),
      );
    });

    it("Sort by asc(title), returns an array", async () => {
      const novel = getters.getNovel();
      const res = await testApp
        .get(`/novels/thumbnail`)
        .query({
          sort: "asc(title)",
        } satisfies NovelQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(ArrayNovelThumbnailSchema).parse(
        res.body,
      );

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      expect(Array.isArray(parsedResult.data)).toBe(true);
      expect(parsedResult.data.length).toBe(7);
      expect(parsedResult.data[0]).toMatchObject(
        NovelThumbnailSchema.parse(novel),
      );
    });

    it("returns empty array when no match", async () => {
      const res = await testApp
        .get(`/novels/thumbnail`)
        .query({ search: "Test" } satisfies NovelQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(ArrayNovelThumbnailSchema).parse(
        res.body,
      );

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data!;
      expect(Array.isArray(resultData)).toBe(true);
      expect(resultData.length).toBe(0);
    });

    it("paginates correctly", async () => {
      const res = await testApp
        .get(`/novels/thumbnail`)
        .query({ page: 1, pageSize: 3 } satisfies NovelQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(
        PaginatedNovelThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const data = parsedResult.data;
      expect(data.items.length).toBe(3);
      expect(data.currentPage).toBe(1);
      expect(data.totalPage).toBe(3);
    });

    it("paginates 2nd page correctly", async () => {
      const res = await testApp
        .get(`/novels/thumbnail`)
        .query({ page: 2, pageSize: 3 } satisfies NovelQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(
        PaginatedNovelThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data!;
      expect(resultData.items.length).toBe(3);
      expect(resultData.currentPage).toBe(2);
      expect(resultData.totalPage).toBe(3);
    });

    it("paginates returns empty array, page 4", async () => {
      const res = await testApp
        .get(`/novels/thumbnail`)
        .query({ page: 4, pageSize: 3 } satisfies NovelQueryInput)
        .expect(200);
      const parsedResult = ApiResponseSchema(
        PaginatedNovelThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data!;
      expect(resultData.items.length).toBe(0);
      expect(resultData.currentPage).toBe(4);
      expect(resultData.totalPage).toBe(3);
    });
  });

  describe("Novel types returns expected fields", () => {
    it("trend returns expected fields", async () => {
      const res = await testApp
        .get(`/novels/trend`)
        .query({ page: 1 })
        .expect(200);

      const parsedResult = ApiResponseSchema(PaginatedNovelTrendSchema).parse(
        res.body,
      );

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data.items;

      const novel = getters.getNovelLast();

      expect(resultData[0]).toMatchObject(NovelTrendSchema.parse(novel));
    });

    it("detail returns expected fields", async () => {
      const res = await testApp.get(`/novels`).query({ page: 1 }).expect(200);

      const parsedResult = ApiResponseSchema(PaginatedNovelDetailSchema).parse(
        res.body,
      );
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data.items;

      const novel = getters.getNovelLast();

      expect(resultData[0]).toMatchObject(novel);
    });
  });
});
