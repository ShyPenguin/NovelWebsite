import type { Resource } from "@/auth/permissions/resource.js";

export const mapSingularResource = {
  authors: "author",
  novels: "novel",
  chapters: "chapter",
  images: "image",
  users: "user",
  bookmarks: "bookmark",
} satisfies Record<Resource, string>;
