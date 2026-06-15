import Page from "@/shared/components/Page";
import type { AnnouncementDetailDTO } from "@repo/contracts/dto/announcement";
import { AnnouncementPreview } from "../components/AnnouncementPreview";

export const AnnouncementDetailPage = ({
  announcement,
}: {
  announcement: AnnouncementDetailDTO;
}) => {
  return (
    <Page>
      <Page.Body>
        <AnnouncementPreview announcement={announcement} />
      </Page.Body>
    </Page>
  );
};
