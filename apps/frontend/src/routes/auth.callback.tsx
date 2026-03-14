import { AuthCallbackPage } from "@/features/auth/page/AuthCallbackPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});
