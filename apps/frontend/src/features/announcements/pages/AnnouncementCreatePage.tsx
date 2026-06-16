import { announcementsIdRoute, CREATE } from "@/shared/constants";
import Page from "@/shared/components/Page";
import { useNavigate } from "@tanstack/react-router";
import { AnnouncementForm } from "../components/form/AnnouncementForm";

export const AnnouncementCreatePage = () => {
  const navigate = useNavigate();
  return (
    <Page>
      <Page.Header title="Create Announcement" className="text-center" />
      <Page.Body type="center">
        <AnnouncementForm
          type={CREATE}
          onClose={(id) => {
            navigate({
              to: announcementsIdRoute,
              params: { id },
            });
          }}
        />
      </Page.Body>
    </Page>
  );
};
