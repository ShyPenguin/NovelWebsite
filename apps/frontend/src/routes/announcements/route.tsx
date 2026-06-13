import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/announcements")({
  component: RouteComponent,
});

export default function RouteComponent() {}
