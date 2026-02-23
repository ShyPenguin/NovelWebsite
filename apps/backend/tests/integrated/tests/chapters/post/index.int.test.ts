import { describe, it, expect, beforeAll } from "vitest";
import { seedBeforeAll } from "./seed.ts";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { app } from "../../../../../src/app.ts";
import { COOKIE_SESSION_KEY } from "../../../../../src/constants/index.ts";
import { ChapterDetailSchema } from "@repo/contracts/schemas/chapter";
import { ChapterDetailDTO, ChapterFormDTO } from "@repo/contracts/dto/chapter";
import { randomUUID } from "crypto";

describe(" POST /novels/:id/chapters", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const novelId = getters.getNovel().id;
    const res = await testApp.post(`/novels/${novelId}/chapters`).expect(401);
    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: `/novels/${novelId}/chapters`,
        statusCode: 401,
        message: "User is not logged in",
      },
    });
  });

  it("403 Unauthorized", async () => {
    const reader = getters.getReader();
    const novelId = getters.getNovel().id;
    const res = await testApp
      .post(`/novels/${novelId}/chapters`)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
      .expect(403);
    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/novels/${novelId}/chapters`,
        statusCode: 403,
        message: "User is not allowed to create a chapter",
      },
    });
  });

  it("400 Validation Middleware Error", async () => {
    const staff = getters.getStaff();
    const novelId = getters.getNovel().id;
    const inputData = getters.getInputChapter();
    const { chapterNumber, ...chapterWithoutChapterNumber } = inputData;
    const res = await testApp
      .post(`/novels/${novelId}/chapters`)
      .send(chapterWithoutChapterNumber)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/novels/${novelId}/chapters`,
        statusCode: 400,
        message: "Chapter's number is required",
      },
    });
  });

  it("400 Chapter's number is already taken", async () => {
    const staff = getters.getStaff();
    const novelId = getters.getNovel().id;
    const seededChapter = getters.getSeededChapter();
    const inputChapter = getters.getInputChapter();
    const chapterWithSeededNumber = {
      ...inputChapter,
      chapterNumber: seededChapter.chapterNumber,
    } satisfies ChapterFormDTO;

    const res = await testApp
      .post(`/novels/${novelId}/chapters`)
      .send(chapterWithSeededNumber)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/novels/${novelId}/chapters`,
        statusCode: 400,
        message: "Chapter's number is already taken",
      },
    });
  });

  it("404 Novel not found", async () => {
    const staff = getters.getStaff();
    const novelId = randomUUID();
    const seededChapter = getters.getSeededChapter();
    const inputChapter = getters.getInputChapter();
    const chapterWithSeededNumber = {
      ...inputChapter,
      chapterNumber: seededChapter.chapterNumber,
    } satisfies ChapterFormDTO;

    const res = await testApp
      .post(`/novels/${novelId}/chapters`)
      .send(chapterWithSeededNumber)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(404);

    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: `/novels/${novelId}/chapters`,
        statusCode: 404,
        message: "Novel not found",
      },
    });
  });

  it("201 success", async () => {
    const staff = getters.getStaff();
    const novelId = getters.getNovel().id;
    const inputChapter = getters.getInputChapter();
    const res = await testApp
      .post(`/novels/${novelId}/chapters`)
      .send(inputChapter)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(201);

    const parsedResult = ApiResponseSchema(ChapterDetailSchema).parse(res.body);
    expect(parsedResult.ok).toBe(true);
    if (!parsedResult.ok) throw new Error("error somehow");

    const { contentHtml, createdAt, updatedAt, id, ...data } =
      parsedResult.data;
    const prevChapter = getters.getSeededChapter().id;
    expect(data).toMatchObject({
      ...inputChapter,
      publishedAt: new Date(inputChapter.publishedAt),
      title: "Test",
      prevChapter,
      novelId: novelId,
    } satisfies Omit<
      ChapterDetailDTO,
      "contentHtml" | "createdAt" | "updatedAt" | "id"
    >);

    expect(parsedResult.data).toHaveProperty("contentHtml");
    expect(
      contentHtml.includes(
        '<p><span style="color: rgb(255, 255, 255); color: #bae6fdff; font-weight: 700; text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);">Player Status',
      ),
    ).toBe(true);
  });
});
