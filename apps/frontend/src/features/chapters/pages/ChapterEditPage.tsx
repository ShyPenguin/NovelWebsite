import { getRouteApi } from "@tanstack/react-router";
import { ChapterEditLayout } from "../layouts/chapter-edit-page/ChapterEditLayout";
import { novelQueryOptions } from "@/features/novels/api/fetchNovel";
import { useQuery } from "@tanstack/react-query";
import { fetchChapterQueryOptions } from "../api/fetchChapter";
import { chaptersIdEditRoute_ } from "@/shared/constants";

export const ChapterEditPage = () => {
  const route = getRouteApi(chaptersIdEditRoute_);
  const { novelId, chapterId } = route.useParams();
  const { data: novel } = useQuery(novelQueryOptions(novelId));
  const { data: chapter } = useQuery(
    fetchChapterQueryOptions({ chapterId: chapterId }),
  );

  return <ChapterEditLayout novel={novel!} chapter={chapter!} />;
};
