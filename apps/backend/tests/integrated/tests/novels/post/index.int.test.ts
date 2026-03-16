import request from "supertest";
import { beforeAll, expect, describe, it } from "vitest";
import { seedBeforeAll } from "./seed.js";
import { ApiResponseSchema } from "@repo/contracts/api";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";
import { randomUUID } from "crypto";
import { app } from "@/app.js";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.js";

describe("POST /novels", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const res = await testApp.post(`/novels`).expect(401);
    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: `/novels`,
        statusCode: 401,
        message: "You're not logged in",
      },
    });
  });

  it("403 Unauthorized", async () => {
    const reader = getters.getReader();
    const inputNovel = getters.getInputNovel();

    const res = await testApp
      .post(`/novels`)
      .send(inputNovel)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
      .expect(403);
    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/novels`,
        statusCode: 403,
        message: "You're not allowed to create a novel",
      },
    });
  });

  it("400 Validation Middleware Error", async () => {
    const staff = getters.getStaff();
    const inputNovel = getters.getInputNovel();
    const { title, ...novelWithoutTitle } = inputNovel;
    const res = await testApp
      .post(`/novels`)
      .send(novelWithoutTitle)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/novels`,
        statusCode: 400,
        message: "Title is required",
      },
    });
  });

  it("400 Validation Title not unique error", async () => {
    const staff = getters.getStaff();
    const inputNovel = getters.getInputNovel();
    const novel = getters.getSeededNovel();

    //data is equals to input novel but with seeded's title
    const data = { ...inputNovel, title: novel.title };

    const res = await testApp
      .post(`/novels`)
      .send(data)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/novels`,
        statusCode: 400,
        message: "Title is already taken",
      },
    });
  });

  it("400 Validation Category IDs are invalid", async () => {
    const staff = getters.getStaff();
    const inputNovel = getters.getInputNovel();
    const categories = getters.getCategories();
    //data is with categories ids that do not exist
    const data = {
      ...inputNovel,
      categories: [randomUUID(), categories[0], randomUUID()],
    };

    const res = await testApp
      .post(`/novels`)
      .send(data)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/novels`,
        statusCode: 400,
        message: "One or more category IDs are invalid",
      },
    });
  });

  it("success", async () => {
    const staff = getters.getStaff();
    const inputNovel = getters.getInputNovel();
    const author = getters.getAuthor();

    const res = await testApp
      .post(`/novels`)
      .send(inputNovel)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(201);

    const parsedResult = ApiResponseSchema(NovelDetailSchema).parse(res.body);
    if (!parsedResult.ok) throw new Error("something went wrong");

    const {
      id,
      author: resAuthor,
      totalChapters,
      translator,
      categories,
      ...sameWithInput
    } = parsedResult.data;

    expect(resAuthor).toMatchObject(author);
    expect(translator).toMatchObject({
      id: staff.user.id,
      name: staff.user.name,
    });
    const {
      categories: inputCategories,
      authorId,
      ...filteredInput
    } = inputNovel;
    expect(categories[0].id).toBe(inputCategories[0]);
    expect(totalChapters).toBe(0);
    expect(sameWithInput).toMatchObject(filteredInput);
  });
});
