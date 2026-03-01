import { NavbarReadingContextProvider } from "@/features/chapters/stores/ChapterMutateUI/NavbarReadingStore/NavbarReadingContext";
import { useQuery } from "@tanstack/react-query";
import { fetchChapterQueryOptions } from "../api/fetchChapter";
import { getRouteApi } from "@tanstack/react-router";
import { ChapterLayout } from "../layouts/chapter-page/ChapterLayout";

export const ChapterPage = () => {
  const route = getRouteApi("/novels_/$novelId/chapters_/$chapterId/");
  const { chapterId } = route.useParams();
  const { data: chapter } = useQuery(
    fetchChapterQueryOptions({ chapterId: chapterId }),
  );
  return (
    <NavbarReadingContextProvider>
      <ChapterLayout chapter={chapter!} />
    </NavbarReadingContextProvider>
  );
};
