import request from "supertest";
import { beforeAll, expect, describe, it } from "vitest";
import { seedBeforeAll } from "./seed.js";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AnnouncementDetailSchema } from "@repo/contracts/schemas/announcement";
import { app } from "@/app.js";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.js";
import { randomUUID } from "crypto";

describe("PUT /announcements/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const status = 401;
    const seededData = getters.getDataSeeded();
    const url = `/announcements/${seededData[0].id}`;
    const res = await testApp.put(url).expect(status);
    const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: url,
        statusCode: status,
        message: "You're not logged in",
      },
    });
  });

  it("403 Unauthorized", async () => {
    const reader = getters.getReader();
    const seededData = getters.getDataSeeded();
    const inputData = getters.getDataInput();

    const status = 403;
    const url = `/announcements/${seededData[0].id}`;

    const res = await testApp
      .put(url)
      .send(inputData)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
      .expect(status);

    const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: url,
        statusCode: status,
        message: "You're not allowed to update this announcement",
      },
    });
  });

  it("404 Not Found", async () => {
    const user = getters.getAdmin();
    const dataToPut = randomUUID();
    const inputData = getters.getDataInput();

    const url = `/announcements/${dataToPut}`;
    const status = 404;

    const res = await testApp
      .put(url)
      .send(inputData)
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(status);

    const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: url,
        statusCode: status,
        message: "Announcement not found",
      },
    });
  });

  it("400 Validation Middleware Error", async () => {
    const admin = getters.getAdmin();
    const inputData = getters.getDataInput();
    const seededData = getters.getDataSeeded()[0];

    const { title, ...announcementWithoutName } = inputData;

    const url = `/announcements/${seededData.id}`;
    const status = 400;

    const res = await testApp
      .put(url)
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
        path: url,
        statusCode: status,
        message: "Title is required",
      },
    });
  });

  it("400 Validation title not unique error", async () => {
    const admin = getters.getAdmin();
    const inputData = getters.getDataInput();
    const seededData = getters.getDataSeeded()[0];
    const otherSeededData = getters.getDataSeeded()[1];
    //data is equals to input announcement but with seeded's title
    const data = { ...inputData, title: otherSeededData.title };

    const url = `/announcements/${seededData.id}`;
    const status = 400;

    const res = await testApp
      .put(url)
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
        path: url,
        statusCode: status,
        message: "Title is already taken",
      },
    });
  });

  it("200 success", async () => {
    const admin = getters.getAdmin();
    const creator = getters.getCreator();
    const seededData = getters.getDataSeeded();
    const inputData = getters.getDataInput();

    const status = 200;
    const url = `/announcements/${seededData[0].id}`;

    const res = await testApp
      .put(url)
      .send(inputData)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${admin.sessionId}`])
      .expect(status);

    const parsedResult = ApiResponseSchema(AnnouncementDetailSchema).parse(
      res.body,
    );
    if (!parsedResult.ok) throw new Error("something went wrong");
    expect(parsedResult.data.title).toBe(inputData.title);
    expect(parsedResult.data.content).toBe(inputData.content);
    expect(parsedResult.data.author).toMatchObject({
      id: creator.user.id,
      name: creator.user.name,
    });
  });
});
