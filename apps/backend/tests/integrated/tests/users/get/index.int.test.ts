import { describe, it, expect, beforeAll } from "vitest";
import { seedBeforeAll } from "./seed.ts";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { randomUUID } from "crypto";
import { app } from "@/app.ts";
import {
  ArrayUserThumbnailSchema,
  PaginatedUserThumbnailSchema,
  UserDetailSchema,
  UserThumbnailSchema,
} from "@repo/contracts/schemas/user";
import { UserQueryInput } from "@/features/users/user.schema.ts";

describe("Get /users", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });
  describe("Query, Sorting,& pagination behavior", () => {
    it("filters by search, returns an array", async () => {
      const resourceToCompare = getters.getAdmin();
      const res = await testApp
        .get(`/users`)
        .query({ search: "Jawad" } satisfies UserQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(ArrayUserThumbnailSchema).parse(
        res.body,
      );

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      expect(Array.isArray(parsedResult.data)).toBe(true);
      expect(parsedResult.data.length).toBe(1);
      expect(parsedResult.data[0]).toMatchObject({
        ...resourceToCompare,
        oAuthProviders: [],
      });
    });

    it("Sort by asc(name), returns an array", async () => {
      const resourceToCompare = getters.getFirstUser();
      const resourceCount = getters.getUsersCount();
      const res = await testApp
        .get(`/users`)
        .query({
          sort: "asc(name)",
        } satisfies UserQueryInput)
        .expect(200);

      const parsedResult = ApiResponseSchema(ArrayUserThumbnailSchema).parse(
        res.body,
      );

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      expect(Array.isArray(parsedResult.data)).toBe(true);
      expect(parsedResult.data.length).toBe(resourceCount);
      expect(parsedResult.data[0]).toMatchObject(resourceToCompare);
    });

    it("paginates correctly", async () => {
      const resourceCount = getters.getUsersCount();

      const query = {
        page: 1,
        pageSize: Math.ceil(resourceCount / 3),
      } satisfies UserQueryInput;
      const res = await testApp.get(`/users`).query(query).expect(200);

      const parsedResult = ApiResponseSchema(
        PaginatedUserThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const data = parsedResult.data;
      expect(data.items.length).toBe(query.pageSize);
      expect(data.currentPage).toBe(1);
      expect(data.totalPage).toBe(Math.ceil(resourceCount / query.pageSize));
    });
    it("paginates 2nd page correctly", async () => {
      const resourceCount = getters.getUsersCount();

      const query = {
        page: 2,
        pageSize: Math.ceil(resourceCount / 3),
      } satisfies UserQueryInput;
      const res = await testApp.get(`/users`).query(query).expect(200);

      const parsedResult = ApiResponseSchema(
        PaginatedUserThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const data = parsedResult.data;
      expect(data.items.length).toBe(query.pageSize);
      expect(data.currentPage).toBe(query.page);
      expect(data.totalPage).toBe(Math.ceil(resourceCount / query.pageSize));
    });

    it("paginates returns empty array, page 4", async () => {
      const resourceCount = getters.getUsersCount();

      const query = {
        page: 4,
        pageSize: Math.ceil(resourceCount / 3),
      } satisfies UserQueryInput;

      const res = await testApp.get(`/users`).query(query).expect(200);

      const parsedResult = ApiResponseSchema(
        PaginatedUserThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const data = parsedResult.data;
      expect(data.items.length).toBe(0);
      expect(data.currentPage).toBe(query.page);
      expect(data.totalPage).toBe(Math.ceil(resourceCount / query.pageSize));
    });
  });

  describe("Get /users/:username", () => {
    it("success", async () => {
      const resourceToGet = getters.getAdmin();
      const res = await testApp
        .get(`/users/${resourceToGet.username}`)
        .expect(200);

      const parsedResult = ApiResponseSchema(UserDetailSchema).parse(res.body);
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw Error("WTF");

      const { novels, ...resultWithoutNovels } = parsedResult.data;
      expect(resultWithoutNovels).toMatchObject(resourceToGet);
      expect(parsedResult.data).toHaveProperty("novels");

      const novelSeeded = getters.getNovel();
      expect(novels[0]).toMatchObject(novelSeeded);
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
});
