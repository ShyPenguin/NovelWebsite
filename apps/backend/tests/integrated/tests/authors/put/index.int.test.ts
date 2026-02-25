import request from "supertest";
import { app } from "../../../../../src/app.ts";
import { beforeAll, expect, describe, it } from "vitest";
import { COOKIE_SESSION_KEY } from "../../../../../src/constants/index.ts";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AuthorSchema } from "@repo/contracts/schemas/author";
import { seedBeforeAll } from "./seed.ts";
import { randomUUID } from "crypto";

describe("PUT /authors/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const dataToUpdate = getters.getDataToUpdate();
    const res = await testApp.put(`/authors/${dataToUpdate.id}`).expect(401);
    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: `/authors/${dataToUpdate.id}`,
        statusCode: 401,
        message: "User is not logged in",
      },
    });
  });
  it("403 Unauthorized", async () => {
    const reader = getters.getReader();
    const dataToUpdate = getters.getDataToUpdate();
    const res = await testApp
      .put(`/authors/${dataToUpdate.id}`)
      .send({ name: "test" })
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
      .expect(403);
    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/authors/${dataToUpdate.id}`,
        statusCode: 403,
        message: "User is not allowed to update this author",
      },
    });
  });

  it("400 Validation Middleware Error", async () => {
    const staff = getters.getStaff();
    const dataToUpdate = getters.getDataToUpdate();
    const res = await testApp
      .put(`/authors/${dataToUpdate.id}`)
      .send({})
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/authors/${dataToUpdate.id}`,
        statusCode: 400,
        message: "Author's name is required",
      },
    });
  });

  it("400 Validation Name not unique error", async () => {
    const staff = getters.getStaff();
    const dataToUpdate = getters.getDataToUpdate();
    const seededData = getters.getDataSeeded();

    //data is equals to input author but with seeded's name
    const data = { name: seededData.name };

    const res = await testApp
      .put(`/authors/${dataToUpdate.id}`)
      .send(data)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/authors/${dataToUpdate.id}`,
        statusCode: 400,
        message: "Name is already taken",
      },
    });
  });

  it("404 Not Found", async () => {
    const requester = getters.getStaff();
    const dataToUpdate = randomUUID();
    const res = await testApp
      .put(`/authors/${dataToUpdate}`)
      .send({ name: "test" })
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${requester.sessionId}`])
      .expect(404);

    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: `/authors/${dataToUpdate}`,
        statusCode: 404,
        message: "Author not found",
      },
    });
  });

  it("successfully updated by staff", async () => {
    const staff = getters.getStaff();
    const dataToUpdate = getters.getDataToUpdate();

    const inputData = {
      name: "Monke",
    };
    const res = await testApp
      .put(`/authors/${dataToUpdate.id}`)
      .send(inputData)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    if (!parsedResult.ok) throw new Error("something went wrong");
    expect(parsedResult.data.name).toBe(inputData.name);
  });

  it("successfully updated by admin", async () => {
    const staff = getters.getStaff();
    const dataToUpdate = getters.getDataToUpdate();

    const inputData = {
      name: "Chicken",
    };
    const res = await testApp
      .put(`/authors/${dataToUpdate.id}`)
      .send(inputData)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(AuthorSchema).parse(res.body);
    if (!parsedResult.ok) throw new Error("something went wrong");
    expect(parsedResult.data.name).toBe(inputData.name);
  });
});
