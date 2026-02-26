import { describe, it, expect, beforeAll } from "vitest";
import { seedBeforeAll } from "./seed.ts";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { ChapterPreviewSchema } from "@repo/contracts/schemas/chapter";
import { ChapterPreviewDTO } from "@repo/contracts/dto/chapter";
import { app } from "@/app.ts";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.ts";

describe(" POST /novels/:id/chapters/preview", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const novelId = getters.getNovel().id;
    const res = await testApp
      .post(`/novels/${novelId}/chapters/preview`)
      .expect(401);
    const parsedResult = ApiResponseSchema(ChapterPreviewSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: `/novels/${novelId}/chapters/preview`,
        statusCode: 401,
        message: "User is not logged in",
      },
    });
  });

  it("403 Unauthorized", async () => {
    const reader = getters.getReader();
    const novelId = getters.getNovel().id;
    const inputChapter = getters.getInputChapter();
    const res = await testApp
      .post(`/novels/${novelId}/chapters/preview`)
      .send(inputChapter)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
      .expect(403);
    const parsedResult = ApiResponseSchema(ChapterPreviewSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/novels/${novelId}/chapters/preview`,
        statusCode: 403,
        message: "User is not allowed to preview a chapter",
      },
    });
  });

  it("400 Validation Middleware Error", async () => {
    const staff = getters.getStaff();
    const novelId = getters.getNovel().id;
    const inputData = getters.getInputChapter();
    const { chapterNumber, ...chapterWithoutChapterNumber } = inputData;
    const res = await testApp
      .post(`/novels/${novelId}/chapters/preview`)
      .send(chapterWithoutChapterNumber)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(ChapterPreviewSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/novels/${novelId}/chapters/preview`,
        statusCode: 400,
        message: "Chapter's number is required",
      },
    });
  });

  it("200 success", async () => {
    const staff = getters.getStaff();
    const novelId = getters.getNovel().id;
    const inputChapter = getters.getInputChapter();
    const res = await testApp
      .post(`/novels/${novelId}/chapters/preview`)
      .send(inputChapter)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(ChapterPreviewSchema).parse(
      res.body,
    );
    expect(parsedResult.ok).toBe(true);
    if (!parsedResult.ok) throw new Error("error somehow");

    const { contentHtml, ...data } = parsedResult.data;
    expect(data).toMatchObject({
      ...inputChapter,
      publishedAt: new Date(inputChapter.publishedAt),
      title: "Test",
    } satisfies Omit<ChapterPreviewDTO, "contentHtml">);

    expect(parsedResult.data).toHaveProperty("contentHtml");
    expect(
      contentHtml.includes(
        '<p><span style="color: rgb(255, 255, 255); color: #bae6fdff; font-weight: 700; text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);">Player Status',
      ),
    ).toBe(true);
  });
});
