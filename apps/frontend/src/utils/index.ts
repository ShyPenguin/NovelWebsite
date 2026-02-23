import type { FullResponseMap } from "@/types/responseTypes";
import type { NovelResponseMap } from "../types";
import type { ChapterResponseMap } from "../types/chapter";
export * from "./formatTimeAge";
export * from "./requireAuth";
export * from "./requireRoles";
export * from "./getFormattedDate";
export * from "./capitalizeFirstLetter";

export const roundToTenth = (num: number): number => Math.round(num * 10) / 10;

export const determineNovelRoute = (
  type: keyof FullResponseMap<NovelResponseMap>,
) => {
  switch (type) {
    case "trends":
      return "trends";
    case "paginated.trends":
      return "trends";
    case "thumbnails":
      return "thumbnails";
    case "paginated.thumbnails":
      return "thumbnails";
    default:
      return "";
  }
};

export const determineChapterRoute = (
  type: keyof FullResponseMap<ChapterResponseMap>,
) => {
  switch (type) {
    case "thumbnails":
      return "thumbnails";
    case "paginated.thumbnails":
      return "thumbnails";
    default:
      return "";
  }
};
