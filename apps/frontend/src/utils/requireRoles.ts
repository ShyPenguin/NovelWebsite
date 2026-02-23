// auth/requireRole.ts
import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import type { Role } from "../types/AuthType";
import { queryAuthOption } from "../api/auth/auth";
import { useAuthUIStore } from "../stores/useAuthUIStore";

export async function requireRoles({
  queryClient,
  roles,
  location,
}: {
  queryClient: QueryClient;
  roles: Role[];
  location: string;
}) {
  const auth = await queryClient.ensureQueryData(queryAuthOption());

  if (!auth) {
    useAuthUIStore.getState().requireLogin();
    throw redirect({ to: location });
  }

  if (!roles.includes(auth.role)) {
    useAuthUIStore.getState().requireRoles(roles);
    throw redirect({ to: location });
  }

  return auth;
}
