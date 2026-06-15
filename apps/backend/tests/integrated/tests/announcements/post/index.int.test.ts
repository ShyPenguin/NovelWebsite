import request from "supertest";
import { beforeAll, expect, describe, it } from "vitest";
import { seedBeforeAll } from "./seed.js";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AnnouncementDetailSchema } from "@repo/contracts/schemas/announcement";
import { app } from "@/app.js";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.js";

describe("POST / announcements", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const status = 401;
    const res = await testApp.post(`/announcements`).expect(status);
    const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: `/announcements`,
        statusCode: status,
        message: "You're not logged in",
      },
    });
  });

  it("403 Unauthorized", async () => {
    const reader = getters.getReader();
    const status = 403;
    const inputData = getters.getDataInput();
    const res = await testApp
      .post(`/announcements`)
      .send(inputData)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
      .expect(status);

    const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/announcements`,
        statusCode: status,
        message: "You're not allowed to create an announcement",
      },
    });
  });

  it("400 Validation Middleware Error", async () => {
    const admin = getters.getAdmin();
    const inputData = getters.getDataInput();
    const status = 400;
    const { title, ...announcementWithoutName } = inputData;
    const res = await testApp
      .post(`/announcements`)
      .send(announcementWithoutName)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${admin.sessionId}`])
      .expect(status);

    const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/announcements`,
        statusCode: status,
        message: "Title is required",
      },
    });
  });

  it("400 Validation title not unique error", async () => {
    const admin = getters.getAdmin();
    const inputData = getters.getDataInput();
    const seededData = getters.getDataSeeded();

    //data is equals to input announcement but with seeded's title
    const data = { ...inputData, title: seededData.title };

    const status = 400;
    const res = await testApp
      .post(`/announcements`)
      .send(data)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${admin.sessionId}`])
      .expect(status);

    const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/announcements`,
        statusCode: status,
        message: "Title is already taken",
      },
    });
  });

  it("success", async () => {
    const admin = getters.getAdmin();
    const inputData = getters.getDataInput();

    const res = await testApp
      .post(`/announcements`)
      .send(inputData)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${admin.sessionId}`])
      .expect(201);

    const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
      res.body,
    );
    if (!parsedResult.ok) throw new Error("something went wrong");
    expect(parsedResult.data.title).toBe(inputData.title);
    expect(parsedResult.data.content).toBe(inputData.content);
    expect(parsedResult.data.author).toMatchObject({
      id: admin.user.id,
      name: admin.user.name,
      username: admin.user.username,
      role: admin.user.role,
    });
  });
});
