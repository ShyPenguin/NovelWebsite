import { useHasPermission } from "@/hooks/useHasPermission";
import type { Permissions } from "@repo/contracts/auth/permissions";

type CanProps<Resource extends keyof Permissions> = {
  resource: Resource;
  action: Permissions[Resource]["action"];
  data?: Permissions[Resource]["dataType"];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function Can<Resource extends keyof Permissions>({
  resource,
  action,
  data,
  children,
  fallback = null,
}: CanProps<Resource>) {
  const allowed = useHasPermission({ resource, action, data });

  if (allowed === null) return null; // loading
  if (!allowed) return <>{fallback}</>;

  return <>{children}</>;
}
