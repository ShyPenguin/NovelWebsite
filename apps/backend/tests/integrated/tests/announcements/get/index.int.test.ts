import { describe, it, expect, beforeAll } from "vitest";
import { seedBeforeAll } from "./seed.js";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import {
  ArrayAnnouncementThumbnailSchema,
  AnnouncementDetailSchema,
  AnnouncementThumbnailSchema,
  PaginatedAnnouncementThumbnailSchema,
} from "@repo/contracts/schemas/announcement";
import { randomUUID } from "crypto";
import { app } from "@/app.js";
import { AnnouncementQueryInput } from "@/features/announcements/announcement.schema.js";

describe("GET /announcements", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  describe("Get announcement by Id", () => {
    it("Success", async () => {
      const { authorId, ...announcement } = getters.getAnnouncement();
      const creator = getters.getCreator();
      const res = await testApp
        .get(`/announcements/${announcement.id}`)
        .expect(200);

      const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
        res.body,
      );
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw Error();
      expect(parsedResult.data).toMatchObject({
        ...announcement,
        author: {
          id: creator.id,
          name: creator.name,
        },
      });
    });

    it("404 Not found", async () => {
      const notRealId = randomUUID();
      const res = await testApp.get(`/announcements/${notRealId}`).expect(404);

      const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
        res.body,
      );
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "NotFoundError",
          path: `/announcements/${notRealId}`,
          statusCode: 404,
          message: "Announcement not found",
        },
      });
    });
  });

  describe("Query, Sorting,& pagination behavior", () => {
    it("filters by search, returns an array", async () => {
      const { authorId, content, ...announcement } = getters.getAnnouncement();
      const query = getters.getQuery();
      const res = await testApp
        .get(`/announcements`)
        .query({ search: query } satisfies AnnouncementQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(
        ArrayAnnouncementThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      expect(Array.isArray(parsedResult.data)).toBe(true);
      expect(parsedResult.data.length).toBe(2);
      expect(parsedResult.data[0]).toMatchObject(announcement);
    });

    it("returns empty array when no match", async () => {
      const res = await testApp
        .get(`/announcements`)
        .query({ search: "SADGE" } satisfies AnnouncementQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(
        ArrayAnnouncementThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data!;
      expect(Array.isArray(resultData)).toBe(true);
      expect(resultData.length).toBe(0);
    });

    it("paginates correctly", async () => {
      const res = await testApp
        .get(`/announcements`)
        .query({ page: 1, pageSize: 3 } satisfies AnnouncementQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(
        PaginatedAnnouncementThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const data = parsedResult.data;
      expect(data.items.length).toBe(3);
      expect(data.currentPage).toBe(1);
      expect(data.totalPage).toBe(2);
    });

    it("paginates 2nd page correctly", async () => {
      const res = await testApp
        .get(`/announcements`)
        .query({ page: 2, pageSize: 3 } satisfies AnnouncementQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(
        PaginatedAnnouncementThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data!;
      expect(resultData.items.length).toBe(3);
      expect(resultData.currentPage).toBe(2);
      expect(resultData.totalPage).toBe(2);
    });

    it("paginates returns empty array, page 3", async () => {
      const res = await testApp
        .get(`/announcements`)
        .query({ page: 3, pageSize: 3 } satisfies AnnouncementQueryInput)
        .expect(200);
      const parsedResult = ApiResponseSchema(
        PaginatedAnnouncementThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data!;
      expect(resultData.items.length).toBe(0);
      expect(resultData.currentPage).toBe(3);
      expect(resultData.totalPage).toBe(2);
    });
  });
});
