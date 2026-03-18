import { userSortWithDirectionField } from "@/factories/users/index.js";
import {
  userRolesField,
  userRolesQueryField,
  oAuthProvidersField,
} from "@/fields/user.fields.js";
import { expect, describe, it } from "vitest";
import { z } from "zod";

// Only Original fields
describe("User fields", () => {
  describe("userRolesField", () => {
    it("returns fail when userRolesField is undefined", () => {
      const { success, error } = userRolesField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Role must be either user, staff, supervisor or admin",
      );
    });

    it("returns fail when userRolesField is not supported status (master)", () => {
      const { success, error } = userRolesField.safeParse("master");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Role must be either user, staff, supervisor or admin",
      );
    });

    it("success", () => {
      const { success } = userRolesField.safeParse("admin");

      expect(success).toBe(true);
    });
  });
  describe("userRolesQueryField", () => {
    it("returns fail when userRolesQueryField is undefined", () => {
      const { success, error } = userRolesQueryField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Role must be either all, user, staff, supervisor or admin",
      );
    });

    it("returns fail when userRolesQueryField is not supported status (master)", () => {
      const { success, error } = userRolesQueryField.safeParse("master");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Role must be either all, user, staff, supervisor or admin",
      );
    });

    it("success", () => {
      const { success } = userRolesQueryField.safeParse("admin");

      expect(success).toBe(true);
    });
  });
  describe("oAuthProvidersField", () => {
    it("returns fail when oAuthProvidersField is undefined", () => {
      const { success, error } = oAuthProvidersField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Providers must be either google or discord",
      );
    });

    it("returns fail when oAuthProvidersField is not supported status (master)", () => {
      const { success, error } = oAuthProvidersField.safeParse("master");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Providers must be either google or discord",
      );
    });

    it("success", () => {
      const { success } = oAuthProvidersField.safeParse("google");

      expect(success).toBe(true);
    });
  });

  describe("userSortWithDirectionField", () => {
    it("returns fail when userSortWithDirectionField is undefined", () => {
      const { success, error } =
        userSortWithDirectionField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Sort must be either asc(createdAt), desc(createdAt), asc(updatedAt), desc(updatedAt), asc(name), desc(name), asc(username) or desc(username)",
      );
    });

    it("returns fail when userSortWithDirectionField is not supported status asc(chicken)", () => {
      const { success, error } =
        userSortWithDirectionField.safeParse("asc(chicken)");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Sort must be either asc(createdAt), desc(createdAt), asc(updatedAt), desc(updatedAt), asc(name), desc(name), asc(username) or desc(username)",
      );
    });

    it("success", () => {
      const { success } = userSortWithDirectionField.safeParse("desc(name)");

      expect(success).toBe(true);
    });
  });
});
