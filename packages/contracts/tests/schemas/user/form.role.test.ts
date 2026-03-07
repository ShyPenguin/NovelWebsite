import { expect, describe, it } from "vitest";
import { z } from "zod";
import { UserChangeRoleDTO } from "../../../src/dto/user";
import { UserRoleChangeSchema } from "../../../src/schemas/user/schema";

const form: UserChangeRoleDTO = {
  role: "admin",
};

describe("UserRoleChangeSchema", () => {
  it("Role defaults to user when role is missng", () => {
    const { role, ...formWithoutRole } = form;
    const { success, data } = UserRoleChangeSchema.safeParse(formWithoutRole);
    expect(success).toBe(true);
    expect(data?.role).toBe("user");
  });
  it("Fails when role is not valid", () => {
    const formWithWrongRole = {
      ...form,
      role: "master",
    };
    const { success, error } =
      UserRoleChangeSchema.safeParse(formWithWrongRole);
    expect(success).toBe(false);
    const flattened = z.flattenError(error!);

    expect(flattened.fieldErrors.role?.[0]).toBe(
      "Role must be either user, staff, supervisor or admin",
    );
  });
  it("Fails when role is not valid", () => {
    const { success } = UserRoleChangeSchema.safeParse(form);
    expect(success).toBe(true);
  });
});
