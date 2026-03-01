import { queryAuthOption } from "@/features/auth/api/auth";
import { useAuthUIStore } from "@/features/auth/store/useAuthUIStore";
import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";

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
