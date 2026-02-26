import { describe, it, expect, beforeAll } from "vitest";
import { seedBeforeAll } from "./seed.ts";
import request from "supertest";
import { ApiResponseSchema } from "@repo/contracts/api";
import { randomUUID } from "crypto";
import {
  ArrayAuthorThumbnailSchema,
  AuthorThumbnailSchema,
  PaginatedAuthorThumbnailSchema,
} from "@repo/contracts/schemas/author";
import { app } from "@/app.ts";
import { AuthorQueryInput } from "@/features/authors/author.schema.ts";

describe("GET /authors", () => {
  let getters: Awaited<ReturnType<typeof seedBeforeAll>>;
  const testApp = request(app);

  beforeAll(async () => {
    getters = await seedBeforeAll();
  });

  describe("Get author by Id", () => {
    it("Success", async () => {
      const author = getters.getAuthor();

      const res = await testApp.get(`/authors/${author.id}`);

      const parsedResult = ApiResponseSchema(AuthorThumbnailSchema).parse(
        res.body,
      );
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw Error();
      expect(parsedResult.data).toMatchObject(author);
    });

    it("Not found", async () => {
      const notRealId = randomUUID();
      const res = await testApp.get(`/authors/${notRealId}`).expect(404);

      const parsedResult = ApiResponseSchema(AuthorThumbnailSchema).parse(
        res.body,
      );
      expect(parsedResult).toMatchObject({
        ok: false,
        error: {
          type: "NotFoundError",
          path: `/authors/${notRealId}`,
          statusCode: 404,
          message: "Author not found",
        },
      });
    });
  });
  describe("Query, Sorting, & pagination behavior", () => {
    it("filters by search, returns an array", async () => {
      const res = await testApp
        .get(`/authors`)
        .query({ search: "Cu" } satisfies AuthorQueryInput);

      const parsedResult = ApiResponseSchema(ArrayAuthorThumbnailSchema).parse(
        res.body,
      );
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      expect(Array.isArray(parsedResult.data)).toBe(true);
      expect(parsedResult.data.length).toBe(3);
    });

    it("returns empty array when no match", async () => {
      const res = await testApp
        .get(`/authors`)
        .query({ search: "Bogarts" } satisfies AuthorQueryInput);

      const parsedResult = ApiResponseSchema(ArrayAuthorThumbnailSchema).parse(
        res.body,
      );

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const resultData = parsedResult.data;
      expect(Array.isArray(resultData)).toBe(true);
      expect(resultData.length).toBe(0);
    });

    it("paginates correctly", async () => {
      const res = await testApp
        .get(`/authors`)
        .query({ page: 1, pageSize: 4 } satisfies AuthorQueryInput);

      const parsedResult = ApiResponseSchema(
        PaginatedAuthorThumbnailSchema,
      ).parse(res.body);
      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const data = parsedResult.data;
      expect(data.items.length).toBe(4);
      expect(data.currentPage).toBe(1);
      expect(data.totalPage).toBe(4);
    });

    it("paginates returns empty array, page 5", async () => {
      const res = await testApp
        .get(`/authors`)
        .query({ page: 5, pageSize: 4 } satisfies AuthorQueryInput);

      const parsedResult = ApiResponseSchema(
        PaginatedAuthorThumbnailSchema,
      ).parse(res.body);

      expect(parsedResult.ok).toBe(true);
      if (!parsedResult.ok) throw new Error(parsedResult.error.message);

      const data = parsedResult.data;
      expect(data.items.length).toBe(0);
      expect(data.currentPage).toBe(5);
      expect(data.totalPage).toBe(4);
    });
  });
});
