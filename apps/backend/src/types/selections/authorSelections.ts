import { AuthorTable } from "@/db/schemas/authors.ts";
import type { AuthorDTO, AuthorSelectDTO } from "@repo/contracts/dto/author";

export const authorSelectMap = {
  detail: {
    id: AuthorTable.id,
    name: AuthorTable.name,
  } satisfies Record<keyof AuthorDTO, unknown>,
} satisfies Record<AuthorSelectDTO, unknown>;
