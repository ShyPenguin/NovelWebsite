import { announcementsIdRoute, EDIT, UPDATE } from "@/shared/constants";
import Page from "@/shared/components/Page";
import { useNavigate } from "@tanstack/react-router";
import { AnnouncementForm } from "../components/form/AnnouncementForm";
import type { AnnouncementDetailDTO } from "@repo/contracts/dto/announcement";

export const AnnouncementEditPage = ({
  announcement,
}: {
  announcement: AnnouncementDetailDTO;
}) => {
  const navigate = useNavigate();
  return (
    <Page>
      <Page.Header title="Update Announcement" className="text-center" />
      <Page.Body type="center">
        <AnnouncementForm
          type={UPDATE}
          onClose={() => {
            navigate({
              to: announcementsIdRoute,
              params: { id: announcement.id },
            });
          }}
          announcement={announcement}
        />
      </Page.Body>
    </Page>
  );
};
