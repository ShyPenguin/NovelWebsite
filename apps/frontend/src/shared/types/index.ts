import z from "zod";
import type { ACTIONS, CREATE, EDIT } from "@/shared/constants";
import { idFieldSchema } from "@repo/contracts/schemas/id";
export * from "./fetchingTypes";
export * from "./dropdownprops";

export type ClassName = {
  className?: string;
};

export type Actions = (typeof ACTIONS)[number];

export type IconProps = ClassName & {
  fillColor?: string;
};

export type LinkProps = ClassName & {
  to?: string;
};

export type MutateTypes = typeof CREATE | typeof EDIT;

export type Paginated<T> = {
  items: T;
  currentPage: number;
  totalPage: number;
};

export type ErrorType = "validation" | "database" | "empty" | "unknown";

export const novelStatusEnum = z.enum(
  ["ALL", "ONGOING", "HIATUS", "DROPPED", "COMPLETED"],
  { message: "Status must be: All, Ongoing, Hiatus, Dropped or Completed" },
);

export const novelSortEnum = z.enum([
  "createdAt",
  "updatedAt",
  "views",
  "title",
]);

// Extract TypeScript types from Zod
export type NovelStatus = z.infer<typeof novelStatusEnum>;
export type NovelSort = z.infer<typeof novelSortEnum>;

export const imageFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= 5 * 1024 * 1024, {
    message: "Max file size is 5MB",
  })
  .refine((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type), {
    message: "Invalid image format",
  });

export const CategorySchema = z.object({
  id: idFieldSchema,
  name: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;
