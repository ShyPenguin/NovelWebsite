import { expect, describe, it } from "vitest";
import { randomUUID } from "crypto";
import { OAuthProviders, UserSession } from "../../src/dto/auth";
import { hasPermission } from "../../src/auth/permissions";

const sampleData = {
  email: "string",
  name: "string",
  username: "string",
  imageUrl: "string",
  oAuthProviders: ["google"] satisfies OAuthProviders[],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const user = {
  id: randomUUID(),
  role: "supervisor",
} satisfies UserSession;
describe("Role: Supervisor", () => {
  describe("update", () => {
    it("Can update itself (not including role)", () => {
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

    it("Can't update other supervisors", () => {
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
    it("Can update staffs", () => {
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
    it("Can update users", () => {
      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        ctx: {
          data: {
            ...sampleData,
            id: randomUUID(),
            role: "user",
          },
        },
      });
      expect(result).toBe(true);
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
          payload: { role: "supervisor" },
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
          payload: { role: "supervisor" },
        },
      });
      expect(result).toBe(false);
    });
    it("Can changeRole staff role", () => {
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
          payload: { role: "user" },
        },
      });
      expect(result).toBe(true);
    });
    it("Can changeRole staff/user role to supervisor", () => {
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
          payload: { role: "supervisor" },
        },
      });
      expect(result).toBe(true);
    });
    it("Can't changeRole staff/user role to admin", () => {
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
    it("Can changeRole users role", () => {
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
          payload: { role: "staff" },
        },
      });
      expect(result).toBe(true);
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
    it("Can't delete admin", () => {
      const result = hasPermission({
        user,
        action: "delete",
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
    it("Can't delete other supervisors", () => {
      const result = hasPermission({
        user,
        action: "delete",
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
    it("Can delete users with staff role", () => {
      const result = hasPermission({
        user,
        action: "delete",
        resource: "users",
        ctx: {
          data: {
            id: randomUUID(),
            role: "staff",
            ...sampleData,
          },
        },
      });
      expect(result).toBe(true);
    });
    it("Can delete users with user role", () => {
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
      expect(result).toBe(true);
    });
  });
});
