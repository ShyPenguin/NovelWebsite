import request from "supertest";
import { app } from "../../../../../src/app.ts";
import { beforeAll, expect, describe, it } from "vitest";
import { COOKIE_SESSION_KEY } from "../../../../../src/constants/index.ts";
import { ApiResponseSchema } from "@repo/contracts/api";
import { AuthorSchema } from "@repo/contracts/schemas/author";
