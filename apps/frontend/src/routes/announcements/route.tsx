import { AnnouncementPage } from "@/features/announcements/pages/AnnouncementPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/announcements")({
  component: AnnouncementPage,
});
