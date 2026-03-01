import { createFileRoute } from "@tanstack/react-router";
import { NovelPageContent } from "@/features/novels/components/NovelPageContent";
import { NovelSearchSchema } from "@/features/novels/novel.schema";

export const Route = createFileRoute("/novels/")({
  validateSearch: (search) => NovelSearchSchema.parse(search),
  component: NovelPageContent,
});
