import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { seedBeforeAll } from "./seed.js";
import { app } from "@/app.js";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.js";
import { BookmarkDetailSchema } from "@repo/contracts/schemas/bookmark";
import { randomUUID } from "crypto";

describe("Delete /bookmarks/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const novel = getters.getBookmarks()[0];
    const url = `/bookmarks/${novel.id}`;
    const res = await testApp.delete(url).expect(401);
    const parsedResult = ApiResponseSchema(BookmarkDetailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: url,
        statusCode: 401,
        message: "You're not logged in",
      },
    });
  });

  it("404 (Novel does not exist)", async () => {
    const url = `/bookmarks/${randomUUID()}`;
    const user = getters.getUser();
    const statusCode = 404;
    const res = await testApp
      .delete(url)
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
        message: "Bookmark not found",
      },
    });
  });

  it("404 (User hasn't bookmarked)", async () => {
    const novel = getters.getBookmarks()[0];
    const url = `/bookmarks/${novel.id}`;
    const user = getters.getOtherUser();
    const statusCode = 404;
    const res = await testApp
      .delete(url)
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
        message: "Bookmark not found",
      },
    });
  });

  it("404 (User hasn't bookmarked)", async () => {
    const novel = getters.getBookmarks()[0];
    const url = `/bookmarks/${novel.id}`;
    const user = getters.getOtherUser();
    const statusCode = 404;
    const res = await testApp
      .delete(url)
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
        message: "Bookmark not found",
      },
    });
  });

  it("204 deleted succesfully by bookmarker", async () => {
    const novel = getters.getBookmarks()[0];
    const url = `/bookmarks/${novel.id}`;
    const user = getters.getUser();
    await testApp
      .delete(url)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(204);
  });
});
