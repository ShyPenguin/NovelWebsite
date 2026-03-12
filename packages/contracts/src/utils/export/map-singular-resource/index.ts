import { Resource } from "../../../auth/permissions/resource";

export const mapSingularResource = {
  authors: "author",
  novels: "novel",
  chapters: "chapter",
  images: "image",
  users: "user",
} satisfies Record<Resource, string>;
