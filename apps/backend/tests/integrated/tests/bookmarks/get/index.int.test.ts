import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { seedBeforeAll } from "./seed.js";
import { app } from "@/app.js";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.js";
import {
  ArrayBookmarkDetailSchema,
  PaginatedBookmarkDetailSchema,
} from "@repo/contracts/schemas/bookmark";
import { BookmarkQueryInput } from "@/features/bookmarks/bookmark.schema.js";

describe("Get /bookmarks", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const url = `/bookmarks`;
    const res = await testApp.get(url).expect(401);
    const parsedResult = ApiResponseSchema(ArrayBookmarkDetailSchema).parse(
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

  it("Other User bookmarks", async () => {
    const url = `/bookmarks`;
    const user = getters.getOtherUser();
    const res = await testApp
      .get(url)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(ArrayBookmarkDetailSchema).parse(
      res.body,
    );
    if (!parsedResult.ok) throw new Error("something went wrong");

    expect(Array.isArray(parsedResult.data)).toBe(true);
    expect(parsedResult.data.length).toBe(0);
  });

  it("Success Array", async () => {
    const url = `/bookmarks`;
    const user = getters.getUser();
    const translator = getters.getTranslator();
    const bookmarked = getters.getBookmarks()[0];
    const res = await testApp
      .get(url)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(ArrayBookmarkDetailSchema).parse(
      res.body,
    );
    if (!parsedResult.ok) throw new Error("something went wrong");

    expect(Array.isArray(parsedResult.data)).toBe(true);
    expect(parsedResult.data.length).toBe(4);

    const resultNovel = parsedResult.data.filter((bookmark) =>
      bookmark.novel.title.includes(bookmarked.title),
    )[0];

    expect(resultNovel).toMatchObject({
      novel: {
        id: bookmarked.id,
        title: bookmarked.title,
        slug: bookmarked.slug,
        description: bookmarked.description,
        coverImageUrl: bookmarked.coverImageUrl,
      },
      translator: {
        id: translator.id,
        name: translator.name,
      },
      userId: user.user.id,
    });
  });
  it("Success Paginated", async () => {
    const url = `/bookmarks`;
    const user = getters.getUser();
    const translator = getters.getTranslator();
    const bookmarked = getters.getBookmarks()[0];
    const res = await testApp
      .get(url)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .query({ page: 1, pageSize: 4 } satisfies BookmarkQueryInput)
      .expect(200);

    const parsedResult = ApiResponseSchema(PaginatedBookmarkDetailSchema).parse(
      res.body,
    );
    if (!parsedResult.ok) throw new Error("something went wrong");

    const data = parsedResult.data;
    expect(data.items.length).toBe(4);
    expect(data.currentPage).toBe(1);
    expect(data.totalPage).toBe(1);

    const resultNovel = parsedResult.data.items.filter((bookmark) =>
      bookmark.novel.title.includes(bookmarked.title),
    )[0];

    expect(resultNovel).toMatchObject({
      novel: {
        id: bookmarked.id,
        title: bookmarked.title,
        slug: bookmarked.slug,
        description: bookmarked.description,
        coverImageUrl: bookmarked.coverImageUrl,
      },
      translator: {
        id: translator.id,
        name: translator.name,
      },
      userId: user.user.id,
    });
  });
  it("paginates returns empty array, page 2", async () => {
    const url = `/bookmarks`;
    const user = getters.getUser();
    const res = await testApp
      .get(url)
      .set("Accept", "application/json")
      .query({ page: 2, pageSize: 4 } satisfies BookmarkQueryInput)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(PaginatedBookmarkDetailSchema).parse(
      res.body,
    );
    if (!parsedResult.ok) throw new Error("something went wrong");

    const data = parsedResult.data;
    expect(data.items.length).toBe(0);
    expect(data.currentPage).toBe(2);
    expect(data.totalPage).toBe(1);
  });
});
