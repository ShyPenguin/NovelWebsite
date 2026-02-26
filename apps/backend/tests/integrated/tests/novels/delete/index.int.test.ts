import { beforeAll, expect, describe, it } from "vitest";
import { seedBeforeAll } from "./seed.ts";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { randomUUID } from "crypto";
import { idFieldSchema } from "@repo/contracts/schemas/id";
import { app } from "@/app.ts";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.ts";
import { testDb } from "tests/integrated/db/db-test.ts";
import { getChaptersTx } from "@/features/chapters/repositories/get-chapters.repository.ts";

describe("DELETE /novels/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });
  describe("404 and 400", () => {
    it("404, Novel not found", async () => {
      const staff = getters.getStaff();
      const notRealId = randomUUID();
      const res = await testApp
        .delete(`/novels/${notRealId}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(404);

      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
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

    it("400, Validation Middleware Error", async () => {
      const novelId = "434343";
      const staff = getters.getStaff();

      const res = await testApp
        .delete(`/novels/${novelId}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(400);

      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "ValidationError",
          path: `/novels/${novelId}`,
          statusCode: 400,
          message: "ID is not in correct format",
        },
      });
    });
  });

  describe("Novels made by staff", () => {
    it("401 Unauthenticated", async () => {
      const novel = getters.getNovelByStaff();
      const res = await testApp
        .delete(`/novels/${novel?.id}`)
        .set("Accept", "application/json")
        .expect(401);
      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "AuthenticationError",
          path: `/novels/${novel?.id}`,
          statusCode: 401,
          message: "User is not logged in",
        },
      });
    });

    it("403 Unauthorized from reader user", async () => {
      const novel = getters.getNovelByStaff();
      const reader = getters.getReader();

      const res = await testApp
        .delete(`/novels/${novel?.id}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
        .expect(403);
      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "AuthorizationError",
          path: `/novels/${novel?.id}`,
          statusCode: 403,
          message: "User is not allowed to delete this novel",
        },
      });
    });

    it("403 Unauthorized from a staff but not the novel's translator", async () => {
      const novel = getters.getNovelByStaff();
      const staff = getters.getSecondStaff();

      const res = await testApp
        .delete(`/novels/${novel?.id}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(403);
      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "AuthorizationError",
          path: `/novels/${novel?.id}`,
          statusCode: 403,
          message: "User is not allowed to delete this novel",
        },
      });
    });

    it("200 deleted successfully by its own translator", async () => {
      const novel = getters.getNovelByStaff();
      const staff = getters.getStaff();

      const res = await testApp
        .delete(`/novels/${novel.id}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(200);

      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error("something went wrong");
      expect(parsedResult.data).toBe(novel.id);

      // Chapters should cascade
      const chapters = await getChaptersTx({
        tx: testDb,
        query: { novelId: novel.id },
        type: "thumbnail",
      });

      expect(chapters.length).toBe(0);
    });

    it("200 deleted successfully by admin", async () => {
      const novel = getters.getNovelSecondByStaff();
      const admin = getters.getAdmin();

      const res = await testApp
        .delete(`/novels/${novel.id}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${admin.sessionId}`])
        .expect(200);

      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error("something went wrong");
      expect(parsedResult.data).toBe(novel.id);
    });
  });
});
