import { Resource } from "@repo/contracts/auth-abac";

export const mapSingularResource = {
  authors: "author",
  novels: "novel",
  chapters: "chapter",
  images: "image",
} satisfies Record<Resource, string>;
