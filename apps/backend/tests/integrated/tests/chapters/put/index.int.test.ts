import { beforeAll, expect, describe, it } from "vitest";
import { seedBeforeAll } from "./seed.js";
import request from "supertest";
import { ChapterDetailSchema } from "@repo/contracts/schemas/chapter";
import { ChapterDetailDTO, ChapterFormDTO } from "@repo/contracts/dto/chapter";
import { randomUUID } from "crypto";
import { ApiResponseSchema } from "@repo/contracts/api";
import { getFormattedDate } from "@repo/contracts/utils/getFormattedDate";
import { app } from "@/app.js";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.js";
import { TEST_SOURCE_DOC_URL } from "tests/constants/index.js";

describe("PUT /chapters/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  describe("404 and 400", () => {
    it("404, Chapter not found", async () => {
      const staff = getters.getStaff();
      const notRealId = randomUUID();
      const inputChapter = getters.getInputChapter();
      const res = await testApp
        .put(`/chapters/${notRealId}`)
        .send(inputChapter)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(404);

      const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(
        res.body,
      );
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
      const staff = getters.getStaff();
      const chapterId = getters.getSeededChapter().id;
      const { sourceDocUrl, ...inputChapter } = getters.getInputChapter();
      const res = await testApp
        .put(`/chapters/${chapterId}`)
        .send(inputChapter)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(400);

      const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(
        res.body,
      );
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "ValidationError",
          path: `/chapters/${chapterId}`,
          statusCode: 400,
          message: "Source document url is required",
        },
      });
    });
  });

  describe("Chapters made by staff", () => {
    it("401 Unauthenticated", async () => {
      const chapter = getters.getSeededChapter();
      const res = await testApp
        .put(`/chapters/${chapter?.id}`)
        .set("Accept", "application/json")
        .expect(401);
      const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(
        res.body,
      );
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
      const chapter = getters.getSeededChapter();
      const reader = getters.getReader();
      const inputChapter = getters.getInputChapter();

      const res = await testApp
        .put(`/chapters/${chapter?.id}`)
        .send(inputChapter)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
        .expect(403);
      const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(
        res.body,
      );
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "AuthorizationError",
          path: `/chapters/${chapter?.id}`,
          statusCode: 403,
          message: "You're not allowed to update this chapter",
        },
      });
    });

    it("403 Unauthorized from a staff but not the chapter's translator", async () => {
      const chapter = getters.getSeededChapter();
      const staff = getters.getStaffSecond();
      const inputChapter = getters.getInputChapter();
      const res = await testApp
        .put(`/chapters/${chapter?.id}`)
        .send(inputChapter)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(403);
      const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(
        res.body,
      );
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "AuthorizationError",
          path: `/chapters/${chapter?.id}`,
          statusCode: 403,
          message: "You're not allowed to update this chapter",
        },
      });
    });

    it("200 update successfully by its own translator", async () => {
      const chapter = getters.getSeededChapter();
      const staff = getters.getStaff();
      const inputChapter = getters.getInputChapter();
      const res = await testApp
        .put(`/chapters/${chapter.id}`)
        .send(inputChapter)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
        .expect(200);

      const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(
        res.body,
      );
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error("something went wrong");

      const { contentHtml, createdAt, updatedAt, ...data } = parsedResult.data;
      expect(data).toMatchObject({
        ...inputChapter,
        id: chapter.id,
        publishedAt: new Date(inputChapter.publishedAt),
        title: "Test 2",
        novelId: chapter.novelId,
      } satisfies Omit<
        ChapterDetailDTO,
        "contentHtml" | "createdAt" | "updatedAt"
      >);

      expect(parsedResult.data).toHaveProperty("contentHtml");
      expect(
        contentHtml.includes(
          '<span style="overflow-wrap: anywhere; color: rgb(255, 255, 255); color: #bae6fdff; font-weight: 700; text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);">Player Status',
        ),
      ).toBe(false);
    });

    it("200 update successfully by admin", async () => {
      const chapter = getters.getSeededChapter();
      const admin = getters.getAdmin();

      const date = new Date();
      const inputChapter = {
        sourceDocUrl: TEST_SOURCE_DOC_URL,
        chapterNumber: 3,
        status: "published",
        access: "free",
        publishedAt: getFormattedDate(date),
      } satisfies ChapterFormDTO;

      const res = await testApp
        .put(`/chapters/${chapter.id}`)
        .send(inputChapter)
        .set("Accept", "application/json")
        .set("Cookie", [`${COOKIE_SESSION_KEY}=${admin.sessionId}`])
        .expect(200);

      const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(
        res.body,
      );
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error("something went wrong");

      const { contentHtml, createdAt, updatedAt, ...data } = parsedResult.data;
      expect(data).toMatchObject({
        ...inputChapter,
        id: chapter.id,
        publishedAt: new Date(inputChapter.publishedAt),
        title: "Test",
        novelId: chapter.novelId,
      } satisfies Omit<
        ChapterDetailDTO,
        "contentHtml" | "createdAt" | "updatedAt"
      >);

      expect(parsedResult.data).toHaveProperty("contentHtml");
      expect(
        contentHtml.includes(
          '<span style="overflow-wrap: anywhere; color: rgb(255, 255, 255); color: #bae6fdff; font-weight: 700; text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);">Player Status',
        ),
      ).toBe(true);
    });
  });
});
