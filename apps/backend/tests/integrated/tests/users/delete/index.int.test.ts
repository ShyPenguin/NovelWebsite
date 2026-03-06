import { beforeAll, expect, describe, it } from "vitest";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { randomUUID } from "crypto";
import { app } from "@/app.ts";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.ts";
import { seedBeforeAll } from "./seed.ts";
import { idFieldSchema } from "@repo/contracts/schemas/id";

describe("DELETE /users/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("400, Validation Middleware Error", async () => {
    const resourceToDelete = "434343";
    const user = getters.getSupervisor();

    const res = await testApp
      .delete(`/users/${resourceToDelete}`)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/users/${resourceToDelete}`,
        statusCode: 400,
        message: "ID is not in correct format",
      },
    });
  });

  it("401 Unauthenticated", async () => {
    const resourceToDelete = getters.getSupervisorToDelete().user;
    const res = await testApp
      .delete(`/users/${resourceToDelete?.id}`)
      .set("Accept", "application/json")
      .expect(401);
    const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: `/users/${resourceToDelete?.id}`,
        statusCode: 401,
        message: "You're not logged in",
      },
    });
  });

  it("403, Unauthorized, Supervisor trying to delete another Supervisor", async () => {
    const user = getters.getSupervisor();
    const resourceToDelete = getters.getSupervisorToDelete().user;
    const res = await testApp
      .delete(`/users/${resourceToDelete?.id}`)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(403);
    const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/users/${resourceToDelete?.id}`,
        statusCode: 401,
        message: "You're not allowed to delete this user",
      },
    });
  });

  it("404, User not found", async () => {
    const user = getters.getAdmin();
    const resourceToDelete = randomUUID();
    const res = await testApp
      .delete(`/users/${resourceToDelete}/role`)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(404);

    const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: `/users/${resourceToDelete}/role`,
        statusCode: 404,
        message: "User not found",
      },
    });
  });

  it("200, supervisor deleted successfully by admin", async () => {
    const resourceToDelete = getters.getSupervisorToDelete().user;
    const user = getters.getAdmin();

    const res = await testApp
      .delete(`/users/${resourceToDelete.id}`)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(idFieldSchema).parse(res.body);
    expect(parsedResult.ok).toBe(true);
    if (!parsedResult.ok) throw new Error("something went wrong");
    expect(parsedResult.data).toBe(resourceToDelete.id);
  });
});
