import { hasPermission } from "@/auth/permissions/resource.js";
import { AnnouncementAuthDTO } from "@/dto/announcement.js";
import { UserSession } from "@/dto/auth.js";
import { randomUUID } from "crypto";
import { describe, expect, it } from "vitest";

const userId = randomUUID();
const sampleData = {
  id: randomUUID(),
  author: {
    id: userId,
    name: "jawad",
  },
} satisfies AnnouncementAuthDTO;

const user = {
  id: userId,
  role: "admin",
} satisfies UserSession;

describe("Resource: Announcement, Role: admin", () => {
  it("Can view announcement", () => {
    const result = hasPermission({
      user,
      action: "view",
      resource: "announcements",
      ctx: {},
    });
    expect(result).toBe(true);
  });
  it("Can create announcement", () => {
    const result = hasPermission({
      user,
      action: "create",
      resource: "announcements",
      ctx: {},
    });
    expect(result).toBe(true);
  });
  describe("update", () => {
    it("Can update own announcement", () => {
      const result = hasPermission({
        user,
        action: "update",
        resource: "announcements",
        ctx: {},
      });
      expect(result).toBe(true);
    });
  });
  describe("delete", () => {
    it("Can delete own announcement", () => {
      const result = hasPermission({
        user,
        action: "delete",
        resource: "announcements",
        ctx: {
          data: sampleData,
        },
      });
      expect(result).toBe(true);
    });
    it("Can delete other announcement", () => {
      const result = hasPermission({
        user,
        action: "delete",
        resource: "announcements",
        ctx: {
          data: {
            ...sampleData,
            author: {
              id: randomUUID(),
              name: "montano",
            },
          },
        },
      });
      expect(result).toBe(true);
    });
  });
});
