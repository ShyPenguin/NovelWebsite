import { describe, it, expect, beforeAll } from "vitest";
import { seedBeforeAll } from "./seed.ts";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { randomUUID } from "crypto";
import { app } from "@/app.ts";
import { UserDetailSchema } from "@repo/contracts/schemas/user";

describe("Get username/:id", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("success", async () => {
    const resourceToGet = getters.getAdmin();
    const res = await testApp
      .get(`/users/${resourceToGet.username}`)
      .expect(200);

    const parsedResult = ApiResponseSchema(UserDetailSchema).parse(res.body);
    expect(parsedResult.ok).toBe(true);
    if (!parsedResult.ok) throw Error("WTF");
  });
  it("404, User not found", async () => {
    const resourceToGet = randomUUID();
    const res = await testApp.get(`/users/${resourceToGet}`).expect(404);

    const parsedResult = ApiResponseSchema(UserDetailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: `/users/${resourceToGet}`,
        statusCode: 404,
        message: "User not found",
      },
    });
  });
});
