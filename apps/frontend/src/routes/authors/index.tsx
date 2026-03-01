import { AuthorSearchSchema } from "@/features/authors/author.schema";
import { AuthorPageContent } from "@/features/authors/components/AuthorPageContent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/authors/")({
  validateSearch: (search) => AuthorSearchSchema.parse(search),
  component: AuthorPageContent,
});
