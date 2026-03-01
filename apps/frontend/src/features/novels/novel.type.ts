import z from "zod";
import type {
  NovelDetailDTO,
  NovelFormDTO,
  NovelThumbnailDTO,
  NovelTrendDTO,
} from "@repo/contracts/dto/novel";
import type { NovelCoverImageFormSchema } from "@/features/novels/novel.schema";
import type { FullResponseMap } from "@/shared/types/responseTypes";

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
  detail: NovelDetailDTO[];
  trend: NovelTrend[];
  thumbnail: NovelThumbnail[];
};

export type FetchNovelsReturn<
  T extends keyof FullResponseMap<NovelResponseMap>,
> = Promise<FullResponseMap<NovelResponseMap>[T]>;
