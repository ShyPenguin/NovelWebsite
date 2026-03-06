import { expect, describe, it } from "vitest";
import { randomUUID } from "crypto";
import { UserSession } from "../../src/dto/auth";
import { hasPermission } from "../../src/auth/permissions";

const sampleData = {
  email: "string",
  name: "string",
  imageUrl: "string",
};

const user = {
  id: randomUUID(),
  role: "admin",
} satisfies UserSession;

describe("Role: admin", () => {
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

    it("Can't update other admins", () => {
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
    it("Can update supervisors", () => {
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
      expect(result).toBe(true);
    });
    it("Can update staffs", () => {
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
    it("Can changeRole supervisor role", () => {
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
      expect(result).toBe(true);
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
          payload: { role: "admin" },
        },
      });
      expect(result).toBe(true);
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
          payload: { role: "admin" },
        },
      });
      expect(result).toBe(true);
    });
  });
  describe("delete", () => {
    it("Can't delete itself", () => {
      const result = hasPermission({
        user,
        action: "delete",
        resource: "users",
        ctx: {
          data: { ...user, ...sampleData },
        },
      });
      expect(result).toBe(false);
    });

    it("Can't delete other admins", () => {
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
    it("Can delete users with supervisor role", () => {
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
      expect(result).toBe(true);
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
