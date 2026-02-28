import type { FullResponseMap } from "../../types/responseTypes";
import type {
  AuthorDetailDTO,
  AuthorThumbnailDTO,
} from "@repo/contracts/dto/author";

export type AuthorResponseMap = {
  thumbnail: AuthorThumbnailDTO[];
  detail: AuthorDetailDTO[];
};

export type FetchAuthorsReturn<
  T extends keyof FullResponseMap<AuthorResponseMap>,
> = FullResponseMap<AuthorResponseMap>[T];
