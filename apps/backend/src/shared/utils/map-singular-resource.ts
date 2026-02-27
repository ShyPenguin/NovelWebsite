import { Resource } from "@repo/contracts/auth/permissions";

export const mapSingularResource = {
  authors: "author",
  novels: "novel",
  chapters: "chapter",
  images: "image",
} satisfies Record<Resource, string>;
