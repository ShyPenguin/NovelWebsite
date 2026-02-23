import { createFileRoute } from "@tanstack/react-router";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ChapterLayout from "@/components/ChapterComponents/ChapterLayout";
import { fetchChapterQueryOptions } from "@/api/chapters/fetchChapter";
import { NavbarReadingContextProvider } from "@/stores/NavbarReadingStore/NavbarReadingContext";

export const Route = createFileRoute("/novels_/$novelId/chapters_/$chapterId/")(
  {
    loader: ({ context: { queryClient }, params: { chapterId } }) => {
      return queryClient.ensureQueryData(
        fetchChapterQueryOptions({ chapterId: chapterId }),
      );
    },
    pendingComponent: () => (
      <div className="min-h-screen flex-center">
        <LoadingSpinner text="Loading Chapter" />
      </div>
    ),
    notFoundComponent: () => {
      return <h4 className="test-inherit text-xxs">Chapter not found</h4>;
    },
    component: RouteComponent,
  },
);

function RouteComponent() {
  const chapter = Route.useLoaderData();
  return (
    <NavbarReadingContextProvider>
      <ChapterLayout chapter={chapter} />
    </NavbarReadingContextProvider>
  );
}
