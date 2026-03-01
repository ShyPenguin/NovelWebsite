import { AuthorPage } from "@/features/authors/pages/AuthorPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/authors")({
  component: AuthorPage,
});
