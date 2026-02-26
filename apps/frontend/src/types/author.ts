import type { FullResponseMap } from "./responseTypes";
import type { AuthorThumbnailDTO } from "@repo/contracts/dto/author";

export type AuthorResponseMap = {
  detail: AuthorThumbnailDTO[];
};

export type FetchAuthorsReturn<
  T extends keyof FullResponseMap<AuthorResponseMap>,
> = FullResponseMap<AuthorResponseMap>[T];
