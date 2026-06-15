import { AnnouncementSearchSchema } from "@/features/announcements/announcement.schema";
import { AnnouncementPageContent } from "@/features/announcements/components/AnnouncementPageContent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/announcements/")({
  validateSearch: (search) => AnnouncementSearchSchema.parse(search),
  component: AnnouncementPageContent,
});
