import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { seedBeforeAll } from "./seed.js";
import { app } from "@/app.js";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.js";
import { BookmarkDetailSchema } from "@repo/contracts/schemas/bookmark";
import { randomUUID } from "crypto";

describe("Post /novels/:id/bookmarks", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const novel = getters.getNovel();
    const url = `/novels/${novel.id}/bookmarks`;
    const statusCode = 401;
    const res = await testApp.post(url).expect(statusCode);
    const parsedResult = ApiResponseSchema(BookmarkDetailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: url,
        statusCode: statusCode,
        message: "You're not logged in",
      },
    });
  });

  it("404 novel not found", async () => {
    const url = `/novels/${randomUUID()}/bookmarks`;
    const user = getters.getUser();
    const statusCode = 404;
    const res = await testApp
      .post(url)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(statusCode);
    const parsedResult = ApiResponseSchema(BookmarkDetailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: url,
        statusCode: statusCode,
        message: "Novel not found",
      },
    });
  });

  it("201 Success", async () => {
    const novel = getters.getNovel();
    const url = `/novels/${novel.id}/bookmarks`;
    const user = getters.getUser();
    const translator = getters.getTranslator();
    const res = await testApp
      .post(url)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(201);

    const parsedResult = ApiResponseSchema(BookmarkDetailSchema).parse(
      res.body,
    );
    if (!parsedResult.ok) throw new Error("something went wrong");
    expect(parsedResult.data).toMatchObject({
      novel: {
        id: novel.id,
        title: novel.title,
        slug: novel.slug,
        description: novel.description,
        coverImageUrl: novel.coverImageUrl,
      },
      translator: {
        id: translator.id,
        name: translator.name,
      },
      userId: user.user.id,
    });
  });
});
