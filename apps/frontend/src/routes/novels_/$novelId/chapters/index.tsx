import { createFileRoute } from "@tanstack/react-router";
import ChapterList from "../../../../components/ChapterListNoticesComponents/ChapterList";
import SkeletonChapterList from "../../../../components/ChapterListNoticesComponents/SkeletonChapterList";
import { ChapterSearchSchema } from "../../../../schemas/chapters/index";

export const Route = createFileRoute("/novels_/$novelId/chapters/")({
  pendingComponent: () => <SkeletonChapterList />,
  component: ChapterList,
  validateSearch: (search) => ChapterSearchSchema.parse(search),
});
