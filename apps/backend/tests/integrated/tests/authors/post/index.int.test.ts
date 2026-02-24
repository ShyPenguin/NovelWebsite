import request from "supertest";
import { app } from "../../../../../src/app.ts";
import { beforeAll, expect, describe, it } from "vitest";
import { seedBeforeAll } from "./seed.ts";
import { COOKIE_SESSION_KEY } from "../../../../../src/constants/index.ts";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AuthorSchema } from "@repo/contracts/schemas/author";

describe("POST / authors", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const res = await testApp.post(`/authors`).expect(401);
    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: `/authors`,
        statusCode: 401,
        message: "User is not logged in",
      },
    });
  });

  it("403 Unauthorized", async () => {
    const reader = getters.getReader();
    const res = await testApp
      .post(`/authors`)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
      .expect(403);
    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/authors`,
        statusCode: 403,
        message: "User is not allowed to create an author",
      },
    });
  });

  it("400 Validation Middleware Error", async () => {
    const staff = getters.getStaff();
    const inputData = getters.getDataInput();
    const { name, ...authorWithoutName } = inputData;
    const res = await testApp
      .post(`/authors`)
      .send(authorWithoutName)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/authors`,
        statusCode: 400,
        message: "Author's name is required",
      },
    });
  });

  it("400 Validation Name not unique error", async () => {
    const staff = getters.getStaff();
    const inputData = getters.getDataInput();
    const seededData = getters.getDataSeeded();

    //data is equals to input author but with seeded's name
    const data = { ...inputData, name: seededData.name };

    const res = await testApp
      .post(`/authors`)
      .send(data)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/authors`,
        statusCode: 400,
        message: "Name is already taken",
      },
    });
  });

  it("success", async () => {
    const staff = getters.getStaff();
    const inputData = getters.getDataInput();

    const res = await testApp
      .post(`/authors`)
      .send(inputData)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(201);

    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    if (!parsedResult.ok) throw new Error("something went wrong");
    expect(parsedResult.data.name).toBe(inputData.name);
  });
});
