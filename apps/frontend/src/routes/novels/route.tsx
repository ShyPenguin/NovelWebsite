import { NovelPage } from "@/features/novels/pages/NovelPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/novels")({
  component: NovelPage,
});
