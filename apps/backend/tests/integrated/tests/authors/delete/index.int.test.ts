import request from "supertest";
import { beforeAll, expect, describe, it } from "vitest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AuthorThumbnailSchema } from "@repo/contracts/schemas/author";
import { seedBeforeAll } from "./seed.ts";
import { randomUUID } from "crypto";
import { idFieldSchema } from "@repo/contracts/schemas/id";
import { NovelDetailSchema } from "@repo/contracts/schemas/novel";
import { app } from "@/app.ts";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.ts";

describe("DELETE /authors/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("401 Unauthenticated", async () => {
    const dataToDelete = getters.getDataToDelete();
    const res = await testApp.delete(`/authors/${dataToDelete.id}`).expect(401);
    const parsedResult = ApiResponseSchema(AuthorThumbnailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: `/authors/${dataToDelete.id}`,
        statusCode: 401,
        message: "You're not logged in",
      },
    });
  });

  it("403 Unauthorized", async () => {
    const reader = getters.getReader();
    const dataToDelete = getters.getDataToDelete();
    const res = await testApp
      .delete(`/authors/${dataToDelete.id}`)
      .send({ name: "test" })
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${reader.sessionId}`])
      .expect(403);
    const parsedResult = ApiResponseSchema(AuthorThumbnailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/authors/${dataToDelete.id}`,
        statusCode: 403,
        message: "You're not allowed to delete this author",
      },
    });
  });

  it("400, Validation Middleware Error", async () => {
    const authorId = "434343";
    const staff = getters.getStaff();

    const res = await testApp
      .delete(`/authors/${authorId}`)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/authors/${authorId}`,
        statusCode: 400,
        message: "ID is not in correct format",
      },
    });
  });

  it("404 Not Found", async () => {
    const requester = getters.getStaff();
    const dataToDelete = randomUUID();
    const res = await testApp
      .delete(`/authors/${dataToDelete}`)
      .send({ name: "test" })
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${requester.sessionId}`])
      .expect(404);

    const parsedResult = ApiResponseSchema(AuthorThumbnailSchema).parse(
      res.body,
    );
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: `/authors/${dataToDelete}`,
        statusCode: 404,
        message: "Author not found",
      },
    });
  });

  it("successfully deleted by staff", async () => {
    const staff = getters.getStaff();
    const dataToDelete = getters.getDataToDelete();

    const res = await testApp
      .delete(`/authors/${dataToDelete.id}`)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
    if (!parsedResult.ok) throw new Error("something went wrong");
    expect(parsedResult.data).toBe(dataToDelete.id);

    const novel = getters.getNovels()[0];
    const novelRes = await testApp
      .get(`/novels/${novel.id}`)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${staff.sessionId}`])
      .expect(200);

    const parsedNovelResult = ApiResponseSchema(NovelDetailSchema).parse(
      novelRes.body,
    );
    if (!parsedNovelResult.ok) throw new Error("something went wrong");
    expect(parsedNovelResult.data.title).toBe(novel.title);
    expect(parsedNovelResult.data.author).toBe(null);
  });

  it("successfully deleted by admin", async () => {
    const admin = getters.getAdmin();
    const dataToDelete = getters.getDataToDeleteAdmin();

    const res = await testApp
      .delete(`/authors/${dataToDelete.id}`)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${admin.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
    if (!parsedResult.ok) throw new Error("something went wrong");
    expect(parsedResult.data).toBe(dataToDelete.id);
  });
});
