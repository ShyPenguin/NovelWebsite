import { ChapterSearchSchema } from "@/features/chapters/chapter.schema";
import ChapterListPaginated from "@/features/chapters/components/ChapterListPaginated";
import SkeletonChapterList from "@/features/chapters/components/SkeletonChapterList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/novels_/$novelId/chapters/")({
  pendingComponent: () => <SkeletonChapterList />,
  component: ChapterListPaginated,
  validateSearch: (search) => ChapterSearchSchema.parse(search),
});
