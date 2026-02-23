import z from "zod";
import type { FullResponseMap } from "./responseTypes";
import type {
  NovelDetailDTO,
  NovelFormDTO,
  NovelThumbnailDTO,
  NovelTrendDTO,
} from "@repo/contracts/dto/novel";
import type { NovelCoverImageFormSchema } from "@/schemas/novels";

export type NovelFormUpdateData = {
  formData: NovelFormDTO;
  novelId: NovelDetailDTO["id"];
};

export type NovelCoverImageForm = z.infer<typeof NovelCoverImageFormSchema>;

export type NovelCoverImageFormWithButton = NovelCoverImageForm & {
  showButtons?: boolean;
};

export type NovelThumbnail = NovelThumbnailDTO;
export type NovelTrend = NovelTrendDTO;

export type NovelResponseMap = {
  all: NovelDetailDTO[];
  trends: NovelTrend[];
  thumbnails: NovelThumbnail[];
};

export type FetchNovelsReturn<
  T extends keyof FullResponseMap<NovelResponseMap>,
> = Promise<FullResponseMap<NovelResponseMap>[T]>;
