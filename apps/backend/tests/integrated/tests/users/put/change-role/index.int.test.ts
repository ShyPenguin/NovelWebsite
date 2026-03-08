import { beforeAll, expect, describe, it } from "vitest";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { randomUUID } from "crypto";
import { app } from "@/app.ts";
import { COOKIE_SESSION_KEY } from "@/shared/constants/index.ts";
import { seedBeforeAll } from "./seed.ts";
import {
  UserChangeRoleDTO,
  UserDetailDTO,
  UserThumbnailDTO,
} from "@repo/contracts/dto/user";
import { UserThumbnailSchema } from "@repo/contracts/schemas/user";

describe("PATCH /users/:id/role", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  it("404, User not found", async () => {
    const supervisor = getters.getSupervisor();
    const notRealId = randomUUID();
    const input = getters.getInput();
    const res = await testApp
      .patch(`/users/${notRealId}/role`)
      .send(input)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${supervisor.sessionId}`])
      .expect(404);

    const parsedResult = ApiResponseSchema(UserThumbnailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "NotFoundError",
        path: `/users/${notRealId}/role`,
        statusCode: 404,
        message: "User not found",
      },
    });
  });

  it("401, Unauthenticated", async () => {
    const input = getters.getInput();
    const resourceToUpdate = getters.getStaff().user;
    const res = await testApp
      .patch(`/users/${resourceToUpdate.id}/role`)
      .send(input)
      .set("Accept", "application/json")
      .expect(401);

    const parsedResult = ApiResponseSchema(UserThumbnailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthenticationError",
        path: `/users/${resourceToUpdate.id}/role`,
        statusCode: 401,
        message: "You're not logged in",
      },
    });
  });
  it("403, Unauthorized due to managing user with higher role", async () => {
    const input = getters.getInput();
    const user = getters.getSupervisor();
    const resourceToUpdate = getters.getAdmin().user;
    const res = await testApp
      .patch(`/users/${resourceToUpdate.id}/role`)
      .send(input)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(403);

    const parsedResult = ApiResponseSchema(UserThumbnailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "AuthorizationError",
        path: `/users/${resourceToUpdate.id}/role`,
        statusCode: 403,
        message: "You're not allowed to update this user",
      },
    });
  });
  it("403, Unauthorized due to payload role higher than session's role", async () => {
    const input = {
      role: "admin",
    } satisfies UserChangeRoleDTO;
    const user = getters.getSupervisor();
    const resourceToUpdate = getters.getStaff().user;
    const res = await testApp
      .patch(`/users/${resourceToUpdate.id}/role`)
      .send(input)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(403);

    const parsedResult = ApiResponseSchema(UserThumbnailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "CustomizedAuthorizationError",
        path: `/users/${resourceToUpdate.id}/role`,
        statusCode: 403,
        message: "Supervisors cannot assign admin role",
      },
    });
  });
  it("400, Validation Error", async () => {
    const input = {
      role: "master",
    };
    const user = getters.getSupervisor();
    const resourceToUpdate = getters.getStaff().user;
    const res = await testApp
      .patch(`/users/${resourceToUpdate.id}/role`)
      .send(input)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(400);

    const parsedResult = ApiResponseSchema(UserThumbnailSchema).parse(res.body);
    expect(parsedResult).toMatchObject({
      ok: false,
      error: {
        type: "ValidationError",
        path: `/users/${resourceToUpdate.id}/role`,
        statusCode: 400,
        message: "Role must be either user, staff, supervisor or admin",
      },
    });
  });
  it("200, Success", async () => {
    const user = getters.getSupervisor();
    const resourceToUpdate = getters.getStaff().user;
    const input = getters.getInput();

    const res = await testApp
      .patch(`/users/${resourceToUpdate.id}/role`)
      .send(input)
      .set("Accept", "application/json")
      .set("Cookie", [`${COOKIE_SESSION_KEY}=${user.sessionId}`])
      .expect(200);

    const parsedResult = ApiResponseSchema(UserThumbnailSchema).parse(res.body);
    if (!parsedResult.ok) throw new Error("Unexpected happen");
    expect(parsedResult.data).toHaveProperty("createdAt");
    expect(parsedResult.data).toHaveProperty("updatedAt");

    const { createdAt, updatedAt, ...resultData } = parsedResult.data;
    const {
      createdAt: _,
      updatedAt: _updated,
      ...inputData
    } = resourceToUpdate;
    expect(resultData).toMatchObject({
      ...inputData,
      role: input.role,
      oAuthProviders: ["google"],
    } satisfies Omit<UserThumbnailDTO, "createdAt" | "updatedAt">);
  });
});
