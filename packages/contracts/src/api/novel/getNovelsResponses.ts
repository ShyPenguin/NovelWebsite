import {
  NovelDetailFactory,
  NovelThumbnailFactory,
  NovelTrendFactory,
} from "../../factories/novel";

export const GetNovelDetailResponsesSchema = NovelDetailFactory.getResponses({
  type: "one",
});
export const GetNovelThumbnailResponsesSchema =
  NovelThumbnailFactory.getResponses({
    type: "one",
  });
export const GetNovelTrendResponsesSchema = NovelTrendFactory.getResponses({
  type: "one",
});

export const GetArrayNovelDetailResponsesSchema =
  NovelDetailFactory.getResponses({ type: "array" });
export const GetArrayNovelThumbnailsResponsesSchema =
  NovelThumbnailFactory.getResponses({ type: "array" });
export const GetArrayNovelTrendsResponsesSchema =
  NovelTrendFactory.getResponses({ type: "array" });

export const GetPaginatedNovelDetailResponsesSchema =
  NovelDetailFactory.getResponses({ type: "paginate" });
export const GetPaginatedNovelThumbnailsResponsesSchema =
  NovelThumbnailFactory.getResponses({ type: "paginate" });
export const GetPaginatedNovelTrendsResponsesSchema =
  NovelTrendFactory.getResponses({ type: "paginate" });
