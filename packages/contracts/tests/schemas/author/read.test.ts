import { expect, describe, it } from "vitest";
import { randomUUID } from "crypto";
import type { AuthorDetailDTO } from "../../../src/dto/author";
import { AuthorDetailSchema } from "../../../src/schemas/author/schema";

const id = randomUUID();
const input: AuthorDetailDTO = {
  id,
  name: "Jawad",
  novels: [
    {
      id: randomUUID(),
      title: "Omniscient",
      coverImageUrl:
        "https://pberoczdewdtspygrofa.supabase.co/storage/v1/object/public/novelwebsite-images/novels/covers/Infinite_Regressor.avif",
      description: "eqweqwe",
    },
    {
      id: randomUUID(),
      title: "Regressor",
      coverImageUrl:
        "https://pberoczdewdtspygrofa.supabase.co/storage/v1/object/public/novelwebsite-images/novels/covers/Infinite_Regressor.avif",
      description: "eqweqwe",
    },
    {
      id: randomUUID(),
      title: "Lacoste",
      coverImageUrl:
        "https://pberoczdewdtspygrofa.supabase.co/storage/v1/object/public/novelwebsite-images/novels/covers/Infinite_Regressor.avif",
      description: "eqweqwe",
    },
  ],
};
describe("AuthorDetailSchema", () => {
  it("fails when id is missing", () => {
    const { id, ...inputWithoutId } = input;

    const { success } = AuthorDetailSchema.safeParse(inputWithoutId);

    expect(success).toBe(false);
  });
  it("fails when name is missing", () => {
    const { name, ...inputWithoutId } = input;

    const { success } = AuthorDetailSchema.safeParse(inputWithoutId);

    expect(success).toBe(false);
  });
  it("fails when novel is missing", () => {
    const { novels, ...inputWithoutNovels } = input;
    const { success } = AuthorDetailSchema.safeParse(inputWithoutNovels);
    expect(success).toBe(false);
  });
  it("success", () => {
    const { success, data } = AuthorDetailSchema.safeParse(input);

    expect(success).toBe(true);
    expect(data).toMatchObject(input);
  });
});
