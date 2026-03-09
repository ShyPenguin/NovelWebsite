import { z } from "zod";
import { createEnumError } from "../utils/createEnumError";

// WRITE NOVEL STATUS
export const userRoles = ["user", "staff", "supervisor", "admin"] as const;
export const oAuthProviders = ["google", "discord"] as const;

export const userRolesField = z.enum(userRoles, {
  message: createEnumError({ fieldName: "Role", array: userRoles }),
});

// READ NOVEL STATUS (QUERY)
export const userRolesQuery = ["all", ...userRoles] as const;

export const userRolesQueryField = z.enum(userRolesQuery, {
  message: createEnumError({ fieldName: "Role", array: userRolesQuery }),
});

export const oAuthProvidersField = z.enum(oAuthProviders, {
  message: createEnumError({ fieldName: "Providers", array: oAuthProviders }),
});
