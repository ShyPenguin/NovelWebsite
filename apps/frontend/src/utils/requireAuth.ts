import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { queryAuthOption } from "../api/auth/auth";
import { useAuthUIStore } from "../stores/useAuthUIStore";

export async function requireAuth(queryClient: QueryClient, location: string) {
  try {
    const data = await queryClient.ensureQueryData(queryAuthOption());

    if (!data) {
      throw Error("not authenticated");
    }
  } catch {
    useAuthUIStore.getState().requireLogin();
    throw redirect({ to: location });
  }
}
