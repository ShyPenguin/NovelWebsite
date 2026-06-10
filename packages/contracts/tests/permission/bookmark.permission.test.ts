import { expect, describe, it } from "vitest";
import { randomUUID } from "crypto";
import { hasPermission } from "@/auth/permissions/resource.js";
import type { OAuthProviders, UserSession } from "@/dto/auth.js";

const user = {
  id: randomUUID(),
  role: "admin",
} satisfies UserSession;

const sampleData = {
  novelId: randomUUID(),
  userId: randomUUID(),
};

describe("Bookmark: admin role", () => {
  describe("view", () => {
    it("Can view bookmark if its your bookmark", () => {
      const data = {
        ...sampleData,
        userId: user.id,
      };
      const result = hasPermission({
        user,
        action: "view",
        resource: "bookmarks",
        ctx: {
          data: { ...user, ...data },
        },
      });
      expect(result).toBe(true);
    });
    it("Can't view bookmark if its NOT your bookmark", () => {
      const result = hasPermission({
        user,
        action: "view",
        resource: "bookmarks",
        ctx: {
          data: { ...user, ...sampleData },
        },
      });
      expect(result).toBe(false);
    });
  });
  describe("create", () => {
    it("Can create bookmark if its your account", () => {
      const data = {
        ...sampleData,
        userId: user.id,
      };
      const result = hasPermission({
        user,
        action: "create",
        resource: "bookmarks",
        ctx: {
          data: { ...user, ...data },
        },
      });
      expect(result).toBe(true);
    });
    it("Can't create bookmark if its NOT your account", () => {
      const result = hasPermission({
        user,
        action: "create",
        resource: "bookmarks",
        ctx: {
          data: { ...user, ...sampleData },
        },
      });
      expect(result).toBe(false);
    });
  });
  describe("delete", () => {
    it("Can delete bookmark if its your bookmark", () => {
      const data = {
        ...sampleData,
        userId: user.id,
      };
      const result = hasPermission({
        user,
        action: "delete",
        resource: "bookmarks",
        ctx: {
          data: { ...user, ...data },
        },
      });
      expect(result).toBe(true);
    });
    it("Can't delete bookmark if its NOT your bookmark", () => {
      const result = hasPermission({
        user,
        action: "delete",
        resource: "bookmarks",
        ctx: {
          data: { ...user, ...sampleData },
        },
      });
      expect(result).toBe(false);
    });
  });
});
