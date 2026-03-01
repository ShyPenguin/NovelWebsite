import { createFileRoute } from "@tanstack/react-router";
import { AuthorCreatePage } from "@/features/authors/pages/AuthorCreatePage";

export const Route = createFileRoute("/authors_/create")({
  component: AuthorCreatePage,
});
