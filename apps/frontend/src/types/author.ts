import type { FullResponseMap } from "./responseTypes";
import type { AuthorDTO } from "@repo/contracts/dto/author";

export type AuthorResponseMap = {
  detail: AuthorDTO[];
};

export type FetchAuthorsReturn<
  T extends keyof FullResponseMap<AuthorResponseMap>,
> = FullResponseMap<AuthorResponseMap>[T];
