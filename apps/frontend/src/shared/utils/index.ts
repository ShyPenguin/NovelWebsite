import type { NovelResponseMap } from "@/features/novels/novel.type";
import type { ChapterResponseMap } from "../../features/chapters/chapter.type";
import type { AuthorResponseMap } from "@/features/authors/author.type";
import type { FullResponseMap } from "../types/responseTypes";
export * from "./formatTimeAge";
export * from "./getFormattedDate";
export * from "./capitalizeFirstLetter";

export const roundToTenth = (num: number): number => Math.round(num * 10) / 10;

export const determineNovelRoute = (
  type: keyof FullResponseMap<NovelResponseMap>,
) => {
  switch (type) {
    case "paginated.trend":
    case "trend":
      return "trend";
    case "paginated.thumbnail":
    case "thumbnail":
      return "thumbnail";
    default:
      return "";
  }
};

export const determineChapterRoute = (
  type: keyof FullResponseMap<ChapterResponseMap>,
) => {
  switch (type) {
    case "paginated.thumbnail":
    case "thumbnail":
      return "thumbnail";
    default:
      return "";
  }
};

export const determineAuthorRoute = (
  type: keyof FullResponseMap<AuthorResponseMap>,
) => {
  switch (type) {
    case "thumbnail":
      return "";
  }
};
