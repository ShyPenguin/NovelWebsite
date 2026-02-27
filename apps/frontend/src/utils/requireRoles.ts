// auth/requireRole.ts
import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { queryAuthOption } from "../auth/api/auth";
import { useAuthUIStore } from "../auth/store/useAuthUIStore";
import type { UserRole } from "@repo/contracts/dto/auth";

export async function requireRoles({
  queryClient,
  roles,
  location,
}: {
  queryClient: QueryClient;
  roles: UserRole[];
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
