import { AuthorForm } from "@/authors/AuthorForm";
import Page from "@/components/Page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/authors_/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page>
      <Page.Header title="Create Author" className="text-center" />
      <Page.Body type="center">
        <AuthorForm type={"CREATE"} />
      </Page.Body>
    </Page>
  );
}
