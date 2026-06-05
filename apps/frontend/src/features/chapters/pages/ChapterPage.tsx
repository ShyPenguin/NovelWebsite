import { NavbarReadingContextProvider } from "@/features/chapters/stores/ChapterMutateUI/NavbarReadingStore/NavbarReadingContext";
import { useQuery } from "@tanstack/react-query";
import { fetchChapterQueryOptions } from "../api/fetchChapter";
import { getRouteApi } from "@tanstack/react-router";
import { ChapterLayout } from "../layouts/chapter-page/ChapterLayout";
import { chaptersIdRoute_ } from "@/shared/constants";

export const ChapterPage = () => {
  const route = getRouteApi(`${chaptersIdRoute_}/`);
  const { chapterNumber } = route.useParams();
  const { data: chapter } = useQuery(
    fetchChapterQueryOptions({ chapterId: chapterNumber }),
  );
  return (
    <NavbarReadingContextProvider>
      <ChapterLayout chapter={chapter!} />
    </NavbarReadingContextProvider>
  );
};
