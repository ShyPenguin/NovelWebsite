import { CREATE } from "@/shared/constants";
import Page from "@/shared/components/Page";
import { useNavigate } from "@tanstack/react-router";
import { AuthorForm } from "../components/form/AuthorForm";

export const AuthorCreatePage = () => {
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
};
