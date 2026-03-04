import { expect, describe, it } from "vitest";
import { randomUUID } from "crypto";
import { UserSession } from "../../src/dto/auth";
import { hasPermission } from "../../src/auth/permissions";

describe("Role: Staff", () => {
  describe("update", () => {
    it("Can update user itself (not including role)", () => {
      const user = {
        id: randomUUID(),
        role: "staff",
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
        role: "staff",
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
    it("Can't update others", () => {
      const user = {
        id: randomUUID(),
        role: "staff",
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
      expect(result).toBe(false);
    });

    it("Can't update others role", () => {
      const user = {
        id: randomUUID(),
        role: "staff",
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
      expect(result).toBe(false);
    });
  });

  describe("delete", () => {
    it("Can delete itself", () => {
      const user = {
        id: randomUUID(),
        role: "staff",
      } satisfies UserSession;

      const result = hasPermission({
        user,
        action: "delete",
        resource: "users",
        data: { ...user, email: "string", name: "string", imageUrl: "string" },
      });
      expect(result).toBe(true);
    });
    it("Can't delete others", () => {
      const user = {
        id: randomUUID(),
        role: "staff",
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
      expect(result).toBe(false);
    });
    it("Can't delete others", () => {
      const user = {
        id: randomUUID(),
        role: "staff",
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
      expect(result).toBe(false);
    });
    it("Can't delete others", () => {
      const user = {
        id: randomUUID(),
        role: "staff",
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
  });
});
