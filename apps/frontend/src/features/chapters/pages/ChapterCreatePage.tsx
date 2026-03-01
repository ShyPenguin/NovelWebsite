import { novelQueryOptions } from "@/features/novels/api/fetchNovel";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { ChapterCreateLayout } from "../layouts/chapter-create-page/ChapterCreateLayout";

export const ChapterCreatePage = () => {
  const route = getRouteApi("/novels_/$novelId/chapters_/create");
  const { novelId } = route.useParams();
  const { data: novel } = useQuery(novelQueryOptions(novelId));

  return <ChapterCreateLayout {...novel!} />;
};
