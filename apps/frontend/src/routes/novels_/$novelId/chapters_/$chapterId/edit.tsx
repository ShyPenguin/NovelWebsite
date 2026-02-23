import { createFileRoute } from "@tanstack/react-router";
import { fetchChapterQueryOptions } from "../../../../../api/chapters/fetchChapter";
import { LoadingSpinner } from "../../../../../components/LoadingSpinner";
import { MutateChapterNavbar } from "../../../../../layouts/chapters/mutate/MutateChapterNavbar";
import { LeftSidebar } from "../../../../../layouts/chapters/mutate/LeftSidebar";
import { LeftSideContent } from "../../../../../layouts/chapters/mutate/LeftSideContent";
import { Main } from "../../../../../layouts/chapters/mutate/Main";
import { novelQueryOptions } from "../../../../../api/novels/fetchNovel";
import { ChapterMutateUIProviders } from "../../../../../stores/ChapterMutateUI/ChapterMutateUIProviders";

export const Route = createFileRoute(
  "/novels_/$novelId/chapters_/$chapterId/edit"
)({
  loader: async ({
    context: { queryClient },
    params: { chapterId, novelId },
  }) => {
    const chapter = await queryClient.ensureQueryData(
      fetchChapterQueryOptions({ chapterId: chapterId })
    );
    const novel = await queryClient.ensureQueryData(novelQueryOptions(novelId));
    return { chapter, novel };
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
});

function RouteComponent() {
  const { chapter } = Route.useLoaderData();

  return (
    <ChapterMutateUIProviders type={"EDIT"} chapter={chapter}>
      <Content />
    </ChapterMutateUIProviders>
  );
}

const Content = () => {
  const { chapter, novel } = Route.useLoaderData();

  return (
    <>
      <section className="relative min-h-screen dark:bg-primary-black bg-white">
        {/* PAGE NAVBAR */}
        <MutateChapterNavbar />

        {/* LEFT BAR */}
        <div className="px-5 pt-5">
          <LeftSidebar>
            <LeftSideContent {...novel} />
          </LeftSidebar>
        </div>
        <Main chapter={chapter} />
      </section>
    </>
  );
};
