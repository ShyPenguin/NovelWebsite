// auth/requireRole.ts
import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import type { UserRole } from "@repo/contracts/dto/auth";
import { queryAuthOption } from "@/features/auth/api/auth";
import { useAuthUIStore } from "@/features/auth/store/useAuthUIStore";

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
    console.log("require Roles triggered auth");
    useAuthUIStore.getState().requireLogin();
    throw redirect({ to: location });
  }

  if (!roles.includes(auth.role)) {
    console.log("require Roles triggered role");

    useAuthUIStore.getState().requireRoles(roles);
    throw redirect({ to: location });
  }

  return auth;
}
