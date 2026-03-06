import { beforeAll, expect, describe, it } from "vitest";
import { seedBeforeAll } from "./seed.ts";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { randomUUID } from "crypto";
import { idFieldSchema } from "@repo/contracts/schemas/id";
import { app } from "@/app.ts";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.ts";

describe("DELETE /chapters/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  describe("404 and 400", () => {
    it("404, Chapter not found", async () => {
      const staff = getters.getStaff();
      const notRealId = randomUUID();
      const res = await testApp
        .delete(`/chapters/${notRealId}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(404);

      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
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

    it("400, Validation Middleware Error", async () => {
      const chapterId = "434343";
      const staff = getters.getStaff();

      const res = await testApp
        .delete(`/chapters/${chapterId}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(400);

      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "ValidationError",
          path: `/chapters/${chapterId}`,
          statusCode: 400,
          message: "ID is not in correct format",
        },
      });
    });
  });

  describe("Chapters made by staff", () => {
    it("401 Unauthenticated", async () => {
      const chapter = getters.getChapterByStaff();
      const res = await testApp
        .delete(`/chapters/${chapter?.id}`)
        .set("Accept", "application/json")
        .expect(401);
      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "AuthenticationError",
          path: `/chapters/${chapter?.id}`,
          statusCode: 401,
          message: "You're not logged in",
        },
      });
    });

    it("403 Unauthorized from reader user", async () => {
      const chapter = getters.getChapterByStaff();
      const reader = getters.getReader();

      const res = await testApp
        .delete(`/chapters/${chapter?.id}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
        .expect(403);
      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "AuthorizationError",
          path: `/chapters/${chapter?.id}`,
          statusCode: 403,
          message: "You're not allowed to delete this chapter",
        },
      });
    });

    it("403 Unauthorized from a staff but not the chapter's translator", async () => {
      const chapter = getters.getChapterByStaff();
      const staff = getters.getSecondStaff();

      const res = await testApp
        .delete(`/chapters/${chapter?.id}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(403);
      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "AuthorizationError",
          path: `/chapters/${chapter?.id}`,
          statusCode: 403,
          message: "You're not allowed to delete this chapter",
        },
      });
    });

    it("200 deleted successfully by its own translator", async () => {
      const chapter = getters.getChapterByStaff();
      const staff = getters.getStaff();

      const res = await testApp
        .delete(`/chapters/${chapter.id}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(200);

      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error("something went wrong");
      expect(parsedResult.data).toBe(chapter.id);
    });

    it("200 deleted successfully by admin", async () => {
      const chapter = getters.getChapterSecondByStaff();
      const admin = getters.getAdmin();

      const res = await testApp
        .delete(`/chapters/${chapter.id}`)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${admin.sessionId}`])
        .expect(200);

      const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error("something went wrong");
      expect(parsedResult.data).toBe(chapter.id);
    });
  });
});
