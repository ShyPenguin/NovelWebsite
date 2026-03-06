import { CustomizedAuthorizationError } from "@/shared/errors/index.ts";
import { cantAssignRole } from "@/shared/utils/cannot-assign-role.ts";
import { PermissionMap } from "@repo/contracts/auth/permissions";
import {
  OAuthProviders,
  UserRole,
  UserSession,
} from "@repo/contracts/dto/auth";
import { randomUUID } from "crypto";
import { describe, it, expect } from "vitest";

const sampleData = {
  email: "string",
  name: "string",
  imageUrl: "string",
  oAuthProviders: ["google"] satisfies OAuthProviders[],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// We're only testing if the messages aligns
describe("Can't Assign Role", () => {
  it("throws when supervisor assigned an admin role", () => {
    const dataUser = {
      id: randomUUID(),
      role: "user",
    } satisfies UserSession;

    const ctx = {
      data: {
        ...dataUser,
        ...sampleData,
      },
      payload: {
        role: "admin",
      },
    } satisfies PermissionMap["users"]["changeRole"];

    const userRole: UserRole = "supervisor";

    const fn = () => cantAssignRole({ userRole, ctx });
    expect(fn).toThrow(CustomizedAuthorizationError);
    expect(fn).toThrow(`${userRole}s cannot assign ${ctx.payload.role} role`);
  });
  it("does not throw when admin assigned an admin role", () => {
    const dataUser = {
      id: randomUUID(),
      role: "supervisor",
    } satisfies UserSession;

    const ctx = {
      data: {
        ...dataUser,
        ...sampleData,
      },
      payload: {
        role: "admin",
      },
    } satisfies PermissionMap["users"]["changeRole"];

    const userRole: UserRole = "admin";

    const fn = () => cantAssignRole({ userRole, ctx });
    expect(fn).not.toThrow();
  });
});
