import type { AuthorDetailDTO } from "@repo/contracts/dto/author";

export const getAuthorOneQueryKey = ({ id }: { id: AuthorDetailDTO["id"] }) => [
  "author",
  id,
];
export const getAuthorsQueryKey = ["authors"];
