import request from "supertest";
import { beforeAll, expect, describe, it } from "vitest";
import { seedBeforeAll } from "./seed.js";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AnnouncementDetailSchema } from "@repo/contracts/schemas/announcement";
import { app } from "@/app.js";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.js";
import { randomUUID } from "crypto";

describe("DELETE /announcements/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const status = 401;
    const seededData = getters.getDataSeeded();
    const url = `/announcements/${seededData[0].id}`;
    const res = await testApp.delete(url).expect(status);
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

    const status = 403;
    const url = `/announcements/${seededData[0].id}`;

    const res = await testApp
      .delete(url)
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
        message: "You're not allowed to delete this announcement",
      },
    });
  });

  it("404 Not Found", async () => {
    const user = getters.getAdmin();
    const dataToDelete = randomUUID();

    const url = `/announcements/${dataToDelete}`;
    const status = 404;

    const res = await testApp
      .delete(url)
      .send({ name: "test" })
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

  it("204 success", async () => {
    const admin = getters.getAdmin();
    const seededData = getters.getDataSeeded();

    const status = 204;
    const url = `/announcements/${seededData[0].id}`;

    await testApp
      .delete(url)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${admin.sessionId}`])
      .expect(status);
  });
});
