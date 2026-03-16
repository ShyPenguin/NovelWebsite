import { beforeAll, expect, describe, it } from "vitest";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";
import { randomUUID } from "crypto";
import { NovelFormDTO } from "@repo/contracts/dto/novel";
import { getFormattedDate } from "@repo/contracts/utils/getFormattedDate";
import { app } from "@/app.js";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.js";
import { seedBeforeAll } from "./seed.js";

describe("PUT /novels/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("404, Novel not found", async () => {
    const staff = getters.getStaff();
    const inputNovel = getters.getInputNovel();
    const notRealId = randomUUID();
    const res = await testApp
      .put(`/novels/${notRealId}`)
      .send(inputNovel)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(404);

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
  it("401 Unauthenticated", async () => {
    const novel = getters.getNovelByStaff();
    const inputNovel = getters.getInputNovel();
    const res = await testApp
      .put(`/novels/${novel?.id}`)
      .send(inputNovel)
      .set("Accept", "application/json")
      .expect(401);
    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: `/novels/${novel?.id}`,
        statusCode: 401,
        message: "You're not logged in",
      },
    });
  });

  it("403 Unauthorized from reader user", async () => {
    const novel = getters.getNovelByStaff();
    const reader = getters.getReader();
    const inputNovel = getters.getInputNovel();

    const res = await testApp
      .put(`/novels/${novel?.id}`)
      .send(inputNovel)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
      .expect(403);
    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/novels/${novel?.id}`,
        statusCode: 403,
        message: "You're not allowed to update this novel",
      },
    });
  });

  it("403 Unauthorized from a staff but not the novel's translator", async () => {
    const inputNovel = getters.getInputNovelSecond();
    const novel = getters.getNovelByStaff();
    const staff = getters.getStaffSecond();

    const res = await testApp
      .put(`/novels/${novel?.id}`)
      .send(inputNovel)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(403);

    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/novels/${novel?.id}`,
        statusCode: 403,
        message: "You're not allowed to update this novel",
      },
    });
  });

  it("400, Validation Middleware Error", async () => {
    const novel = getters.getNovelByStaff();
    const staff = getters.getStaff();
    const { title, ...novelWithoutTitle } = novel;

    const res = await testApp
      .put(`/novels/${novel?.id}`)
      .send(novelWithoutTitle)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/novels/${novel?.id}`,
        statusCode: 400,
        message: "Title is required",
      },
    });
  });

  it("400 Validation Title not unique error", async () => {
    const novel = getters.getNovelByStaff();

    const staff = getters.getStaff();
    const novelSecond = getters.getNovelSecondByStaff();

    const inputNovel = {
      title: novel.title,
      authorId: novel.author!.id,
      description: novel.description,
      type: novel.type,
      language: novel.language,
      status: novel.status,
      release: getFormattedDate(new Date(novel.release)),
      schedule: novel.schedule,
      categories: novel.categories.map((c) => c.id),
    } satisfies NovelFormDTO;

    //inputting the same novel except with the title of the other inputted novel
    const res = await testApp
      .put(`/novels/${novel.id}`)
      .send({ ...inputNovel, title: novelSecond.title })
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/novels/${novel?.id}`,
        statusCode: 400,
        message: "Title is already taken",
      },
    });
  });

  it("200 updated successfully by its own translator", async () => {
    const staff = getters.getStaff();
    const inputNovel = getters.getInputNovel();
    const novel = getters.getNovelByStaff();

    const res = await testApp
      .put(`/novels/${novel.id}`)
      .send(inputNovel)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult.ok).toBe(true);
    if (!parsedResult.ok) throw new Error("something went wrong");

    const {
      author: resAuthor,
      totalChapters,
      translator,
      categories,
      ...sameWithInput
    } = parsedResult.data;

    // The input novel has the second author
    const author = getters.getAuthorSecond();
    expect(resAuthor).toMatchObject(author);

    expect(translator).toMatchObject({
      id: staff.user.id,
      name: staff.user.name,
    });

    const {
      categories: inputCategories,
      authorId,
      release,
      ...filteredInput
    } = inputNovel;

    expect(getFormattedDate(sameWithInput.release)).toBe(release);
    expect(categories[0].id).toBe(inputCategories[0]);
    expect(totalChapters).toBe(0);
    expect(sameWithInput).toMatchObject(filteredInput);
  });

  it("200 updated successfully by admin", async () => {
    const novel = getters.getNovelByStaff();
    const admin = getters.getAdmin();
    const inputNovel = getters.getInputNovelSecond();

    const res = await testApp
      .put(`/novels/${novel.id}`)
      .send(inputNovel)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${admin.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult.ok).toBe(true);
    if (!parsedResult.ok) throw new Error("something went wrong");

    const {
      author: resAuthor,
      totalChapters,
      translator,
      categories,
      ...sameWithInput
    } = parsedResult.data;

    // The input novel has the first author
    const author = getters.getAuthor();
    expect(resAuthor).toMatchObject(author);

    const staff = getters.getStaff();
    expect(translator).toMatchObject({
      id: staff.user.id,
      name: staff.user.name,
    });

    const {
      categories: inputCategories,
      authorId,
      release,
      ...filteredInput
    } = inputNovel;
    expect(getFormattedDate(sameWithInput.release)).toBe(release);
    expect(categories[0].id).toBe(inputCategories[0]);
    expect(totalChapters).toBe(0);
    expect(sameWithInput).toMatchObject(filteredInput);
  });
});
