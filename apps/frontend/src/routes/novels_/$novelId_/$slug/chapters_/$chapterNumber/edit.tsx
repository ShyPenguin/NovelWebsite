import { createFileRoute } from "@tanstack/react-router";
import { ChapterEditPage } from "@/features/chapters/pages/ChapterEditPage";
import { fetchChapterQueryOptions } from "@/features/chapters/api/fetchChapter";
import { novelQueryOptions } from "@/features/novels/api/fetchNovel";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { checkUserPermission } from "@/features/auth/utils/check-user-permission";
import { NotFound } from "@/shared/components/NotFound";

export const Route = createFileRoute(
  "/novels_/$novelId_/$slug/chapters_/$chapterNumber/edit",
)({
  loader: async ({
    context: { queryClient },
    params: { chapterNumber, novelId, slug },
  }) => {
    const chapter = await queryClient.ensureQueryData(
      fetchChapterQueryOptions({ chapterId: chapterNumber }),
    );

    const novel = await queryClient.ensureQueryData(novelQueryOptions(novelId));

    const url = `/novels/${novelId}/${slug}/chapters/${chapterNumber}`;

    await checkUserPermission({
      resource: "chapters",
      action: "update",
      ctx: {
        data: {
          id: chapter.id,
          novelId: chapter.novelId,
          translator: chapter.translator,
        },
      },
      location: url,
    });

    return { chapter, novel };
  },
  pendingComponent: () => (
    <div className="min-h-screen flex-center">
      <LoadingSpinner text="Loading Chapter" />
    </div>
  ),
  notFoundComponent: () => {
    return <NotFound resource="chapters" />;
  },

  component: ChapterEditPage,
});
