import { expect, describe, it } from "vitest";
import { randomUUID } from "crypto";
import { UserSession } from "../../src/dto/auth";
import { hasPermission } from "../../src/auth/permissions";

describe("Role: admin", () => {
  describe("update", () => {
    it("Can update user itself (not including role)", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        data: { ...user, email: "string", name: "string", imageUrl: "string" },
      });
      expect(result).toBe(true);
    });
    it("Can't update it's own role", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        data: { ...user, email: "string", name: "string", imageUrl: "string" },
        privilege: true,
      });
      expect(result).toBe(false);
    });
    it("Can't update other admins", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        data: {
          id: randomUUID(),
          role: "admin",
          email: "string",
          name: "string",
          imageUrl: "string",
        },
      });
      expect(result).toBe(false);
    });
    it("Can update supervisors", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        data: {
          id: randomUUID(),
          role: "supervisor",
          email: "string",
          name: "string",
          imageUrl: "string",
        },
      });
      expect(result).toBe(true);
    });
    it("Can update staffs", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        data: {
          id: randomUUID(),
          role: "staff",
          email: "string",
          name: "string",
          imageUrl: "string",
        },
      });
      expect(result).toBe(true);
    });

    it("Can update users role", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        data: {
          id: randomUUID(),
          role: "user",
          email: "string",
          name: "string",
          imageUrl: "string",
        },
        privilege: true,
      });
      expect(result).toBe(true);
    });
    it("Can update staff role", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        data: {
          id: randomUUID(),
          role: "staff",
          email: "string",
          name: "string",
          imageUrl: "string",
        },
        privilege: true,
      });
      expect(result).toBe(true);
    });
    it("Can update supervisor role", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "update",
        resource: "users",
        data: {
          id: randomUUID(),
          role: "supervisor",
          email: "string",
          name: "string",
          imageUrl: "string",
        },
        privilege: true,
      });
      expect(result).toBe(true);
    });
  });

  describe("delete", () => {
    it("Can't delete itself", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "delete",
        resource: "users",
        data: { ...user, email: "string", name: "string", imageUrl: "string" },
        privilege: true,
      });
      expect(result).toBe(false);
    });

    it("Can't delete other admins", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "delete",
        resource: "users",
        data: {
          id: randomUUID(),
          role: "admin",
          email: "string",
          name: "string",
          imageUrl: "string",
        },
      });
      expect(result).toBe(false);
    });
    it("Can delete users with supervisor role", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "delete",
        resource: "users",
        data: {
          id: randomUUID(),
          role: "supervisor",
          email: "string",
          name: "string",
          imageUrl: "string",
        },
      });
      expect(result).toBe(true);
    });
    it("Can delete users with staff role", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "delete",
        resource: "users",
        data: {
          id: randomUUID(),
          role: "staff",
          email: "string",
          name: "string",
          imageUrl: "string",
        },
      });
      expect(result).toBe(true);
    });
    it("Can delete users with user role", () => {
      const user = {
        id: randomUUID(),
        role: "admin",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "delete",
        resource: "users",
        data: {
          id: randomUUID(),
          role: "user",
          email: "string",
          name: "string",
          imageUrl: "string",
        },
      });
      expect(result).toBe(true);
    });
  });
});
