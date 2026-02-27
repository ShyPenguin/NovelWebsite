import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { queryAuthOption } from "../auth/api/auth";
import { useAuthUIStore } from "../auth/store/useAuthUIStore";

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
