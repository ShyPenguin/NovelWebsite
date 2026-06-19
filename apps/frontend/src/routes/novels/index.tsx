import { createFileRoute } from "@tanstack/react-router";
import { NovelPageContent } from "@/features/novels/components/NovelPageContent";
import { NovelSearchPaginatedSchema } from "@/features/novels/novel.schema";

export const Route = createFileRoute("/novels/")({
  validateSearch: (search) => NovelSearchPaginatedSchema.parse(search),
  component: NovelPageContent,
});
