import type { Resource } from "@/auth/permissions/resource.js";

export const mapSingularResource = {
  authors: "author",
  novels: "novel",
  chapters: "chapter",
  images: "image",
  users: "user",
  bookmarks: "bookmark",
  announcements: "announcement",
} satisfies Record<Resource, string>;
