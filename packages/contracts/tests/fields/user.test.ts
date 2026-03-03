import { expect, describe, it } from "vitest";
import { z } from "zod";
import {
  oAuthProvidersField,
  userRolesField,
} from "../../src/fields/user.fields";

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
});
