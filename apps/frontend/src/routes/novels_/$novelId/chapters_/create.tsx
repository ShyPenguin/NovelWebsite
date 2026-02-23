// routes/novels/$novelId/chapters/create.tsx
import { createFileRoute } from "@tanstack/react-router";
import { novelQueryOptions } from "../../../../api/novels/fetchNovel";
import {
  PreviewChapterProvider,
  usePreviewChapter,
} from "../../../../stores/ChapterMutateUI/PreviewChapterContext";
import { LeftSidebar } from "../../../../layouts/chapters/mutate/LeftSidebar";
import { requireRoles } from "../../../../utils";
import { MutateChapterNavbar } from "../../../../layouts/chapters/mutate/MutateChapterNavbar";
import { LeftSideContent } from "../../../../layouts/chapters/mutate/LeftSideContent";
import { Main } from "../../../../layouts/chapters/mutate/Main";
import { ChapterMutateUIProviders } from "../../../../stores/ChapterMutateUI/ChapterMutateUIProviders";

export const Route = createFileRoute("/novels_/$novelId/chapters_/create")({
  loader: ({ context: { queryClient }, params: { novelId } }) => {
    return queryClient.ensureQueryData(novelQueryOptions(novelId));
  },
  component: RouteComponent,
  beforeLoad: async ({ context: { queryClient }, params: { novelId } }) => {
    const url = `/novels/${novelId}/chapters`;
    await requireRoles({
      queryClient,
      roles: ["staff", "admin"],
      location: url,
    });
  },
});

function RouteComponent() {
  return (
    <PreviewChapterProvider>
      <ChapterMutateUIProviders type={"CREATE"}>
        <Content />
      </ChapterMutateUIProviders>
    </PreviewChapterProvider>
  );
}

const Content = () => {
  const { previewed } = usePreviewChapter();
  const novel = Route.useLoaderData();

  return (
    <>
      <section className="relative flex size-full min-h-screen dark:bg-primary-black bg-white">
        {/* PAGE NAVBAR */}
        {previewed && <MutateChapterNavbar />}

        {/* LEFT BAR */}
        <div className="px-5 pt-5">
          {!previewed && <LeftSideContent {...novel} />}
          {previewed && (
            <LeftSidebar>
              <LeftSideContent {...novel} />
            </LeftSidebar>
          )}
        </div>
        {previewed && <Main />}
      </section>
    </>
  );
};
