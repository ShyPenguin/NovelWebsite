import { z } from "zod";
import { createEnumError } from "../utils/createEnumError";

export const userRoles = ["user", "staff", "supervisor", "admin"] as const;
export const oAuthProviders = ["google", "discord"] as const;

export const userRolesField = z.enum(userRoles, {
  message: createEnumError({ fieldName: "Role", array: userRoles }),
});

export const oAuthProvidersField = z.enum(oAuthProviders, {
  message: createEnumError({ fieldName: "Providers", array: oAuthProviders }),
});
