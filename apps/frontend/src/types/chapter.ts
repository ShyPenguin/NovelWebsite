import type { FullResponseMap } from "./responseTypes";
import type {
  ChapterDetailDTO,
  ChapterFormParsedDTO,
  ChapterThumbnailDTO,
} from "@repo/contracts/dto/chapter";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";

export type ChapterInsertData = {
  formData: ChapterFormParsedDTO;
  novelId: NovelDetailDTO["id"];
};
export type ChapterUpdateData = {
  formData: ChapterFormParsedDTO;
  chapterId: ChapterDetailDTO["id"];
};

export type ChapterResponseMap = {
  detail: ChapterDetailDTO[];
  thumbnails: ChapterThumbnailDTO[];
};

export type FetchChaptersReturn<
  T extends keyof FullResponseMap<ChapterResponseMap>,
> = Promise<FullResponseMap<ChapterResponseMap>[T]>;
