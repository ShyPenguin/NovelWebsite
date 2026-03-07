import { expect, describe, it } from "vitest";
import { z } from "zod";
import { UserFormDTO } from "../../../src/dto/user";
import { UserFormSchema } from "../../../src/schemas/user/schema";

const form: UserFormDTO = {
  name: "Jawad",
};

describe("UserFormSchema", () => {
  it("Fails when name is missing", () => {
    const { name, ...formWithoutname } = form;
    const { success, error } = UserFormSchema.safeParse(formWithoutname);
    expect(success).toBe(false);
    const flattened = z.flattenError(error!);

    expect(flattened.fieldErrors.name?.[0]).toBe("name is required");
  });
  it("Fails when name is empty string", () => {
    const formWithEmptyname = {
      ...form,
      name: "",
    };
    const { success, error } = UserFormSchema.safeParse(formWithEmptyname);
    expect(success).toBe(false);
    const flattened = z.flattenError(error!);

    expect(flattened.fieldErrors.name?.[0]).toBe("1 Letter minimum for name");
  });
  it("Fails when name is 51 characters", () => {
    const formWithEmptyname = {
      ...form,
      name: "a".repeat(51),
    };
    const { success, error } = UserFormSchema.safeParse(formWithEmptyname);
    expect(success).toBe(false);
    const flattened = z.flattenError(error!);

    expect(flattened.fieldErrors.name?.[0]).toBe("50 Letters maximum for name");
  });
  it("Fails when name isn't character", () => {
    const formWithNumbername = {
      ...form,
      name: 21,
    };
    const { success, error } = UserFormSchema.safeParse(formWithNumbername);
    expect(success).toBe(false);
    const flattened = z.flattenError(error!);

    expect(flattened.fieldErrors.name?.[0]).toBe("name must be a string");
  });
  it("Fails when name isn't character", () => {
    const { success, error } = UserFormSchema.safeParse(form);
    expect(success).toBe(true);
  });
});
