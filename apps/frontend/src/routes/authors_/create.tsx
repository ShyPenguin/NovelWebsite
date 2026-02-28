import { AuthorForm } from "@/features/authors/AuthorForm";
import Page from "@/components/Page";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CREATE } from "@/constants";

export const Route = createFileRoute("/authors_/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <Page>
      <Page.Header title="Create Author" className="text-center" />
      <Page.Body type="center">
        <AuthorForm
          type={CREATE}
          onClose={(id) => {
            navigate({
              to: "/authors/$authorId",
              params: { authorId: id },
            });
          }}
        />
      </Page.Body>
    </Page>
  );
}
