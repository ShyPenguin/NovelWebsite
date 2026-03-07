import { expect, describe, it } from "vitest";
import { randomUUID } from "crypto";
import { OAuthProviders, UserSession } from "../../src/dto/auth";
import { hasPermission } from "../../src/auth/permissions";

const sampleData = {
  email: "string",
  name: "string",
  imageUrl: "string",
  oAuthProviders: ["google"] satisfies OAuthProviders[],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const user = {
  id: randomUUID(),
  role: "user",
} satisfies UserSession;

describe("Role: User", () => {
  describe("update", () => {
    it("Can update user itself (not including role)", () => {
      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        ctx: {
          data: { ...user, ...sampleData },
        },
      });
      expect(result).toBe(true);
    });

    it("Can't update admin", () => {
      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        ctx: {
          data: {
            id: randomUUID(),
            role: "admin",
            ...sampleData,
          },
        },
      });
      expect(result).toBe(false);
    });

    it("Can't update supervisor", () => {
      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        ctx: {
          data: {
            id: randomUUID(),
            role: "supervisor",
            ...sampleData,
          },
        },
      });
      expect(result).toBe(false);
    });

    it("Can't update staff", () => {
      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        ctx: {
          data: {
            id: randomUUID(),
            role: "staff",
            ...sampleData,
          },
        },
      });
      expect(result).toBe(false);
    });

    it("Can't update users", () => {
      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        ctx: {
          data: {
            id: randomUUID(),
            role: "user",
            ...sampleData,
          },
        },
      });
      expect(result).toBe(false);
    });
  });

  describe("changeRole", () => {
    it("Can't changeRole it's own role", () => {
      const result = hasPermission({
        user,
        action: "changeRole",
        resource: "users",
        ctx: {
          data: { ...user, ...sampleData },
          payload: { role: "admin" },
        },
      });
      expect(result).toBe(false);
    });
    it("Can't changeRole others role", () => {
      const result = hasPermission({
        user,
        action: "changeRole",
        resource: "users",
        ctx: {
          data: {
            id: randomUUID(),
            role: "user",
            ...sampleData,
          },
          payload: { role: "admin" },
        },
      });
      expect(result).toBe(false);
    });
    it("Can't changeRole staff role", () => {
      const result = hasPermission({
        user,
        action: "changeRole",
        resource: "users",
        ctx: {
          data: {
            id: randomUUID(),
            role: "staff",
            ...sampleData,
          },
          payload: { role: "admin" },
        },
      });
      expect(result).toBe(false);
    });
    it("Can't changeRole supervisor role", () => {
      const result = hasPermission({
        user,
        action: "changeRole",
        resource: "users",
        ctx: {
          data: {
            id: randomUUID(),
            role: "supervisor",
            ...sampleData,
          },
          payload: { role: "admin" },
        },
      });
      expect(result).toBe(false);
    });
    it("Can't changeRole admin role", () => {
      const result = hasPermission({
        user,
        action: "changeRole",
        resource: "users",
        ctx: {
          data: {
            id: randomUUID(),
            role: "admin",
            ...sampleData,
          },
          payload: { role: "admin" },
        },
      });
      expect(result).toBe(false);
    });
  });

  describe("delete", () => {
    it("Can delete itself", () => {
      const result = hasPermission({
        user,
        action: "delete",
        resource: "users",
        ctx: {
          data: { ...user, ...sampleData },
        },
      });
      expect(result).toBe(true);
    });
    it("Can't delete others", () => {
      const result = hasPermission({
        user,
        action: "delete",
        resource: "users",
        ctx: {
          data: {
            id: randomUUID(),
            role: "user",
            ...sampleData,
          },
        },
      });
      expect(result).toBe(false);
    });
  });
});
